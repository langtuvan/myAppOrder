import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  OrderExport,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from './schemas/order.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderGateway } from './order.gateway';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private orderGateway: OrderGateway,
  ) {}

  /**
   * Calculate subtotal and total amount for an order
   * Subtotal = sum of (quantity * price) for all items
   * Total = subtotal + shippingFee + taxes - discount
   */
  calculateOrderTotals(order: Partial<Order>): {
    subTotal: number;
    totalAmount: number;
  } {
    const subTotal =
      order.items?.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0) || 0;

    const taxes = 0.08 * subTotal;

    const totalAmount =
      subTotal +
      (order?.deliveryPrice || 0) +
      (taxes || 0) -
      (order?.discount || 0);

    return { subTotal, totalAmount };
  }

  async CheckProductAvailability(order: Partial<Order>): Promise<void> {
    for (const item of order.items) {
      const product = await this.productModel.findById(item.product).exec();
      if (!product) {
        this.logger.warn(`Product with ID ${item.product} not found`);
        throw new NotFoundException(
          `Product with ID ${item.product} not found`,
        );
      }
      if (!product.isAvailable) {
        this.logger.warn(`Product ${product.name} is not available`);
        throw new BadRequestException(
          `Product ${product.name} is not available`,
        );
      }
      if (product.stock < item.quantity) {
        this.logger.warn(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }
    // if status is confirm Update product stock
    for (const item of order.items) {
      try {
        await this.productModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      } catch (error) {
        throw new BadRequestException(
          `Insufficient stock for product . Available: , Requested: ${item.quantity}`,
        );
      }
    }
  }

  async create(
    input: Partial<CreateOrderDto>,
    createdBy?: string,
  ): Promise<Order> {
    const createOrderDto = input as Order;
    const { subTotal, totalAmount } = await this.calculateOrderTotals(
      createOrderDto as any,
    );
    if (createOrderDto.orderType === OrderType.IN_STORE) {
      createOrderDto.trackingNumber = `order-${Date.now()}`;
      if (createOrderDto.orderExport === OrderExport.QUICK) {
        // checker, cashier, exporter all same as createdBy
        createOrderDto.checker = createdBy;
        createOrderDto.cashier = createdBy;
        createOrderDto.exporter = createdBy;
        // status completed and paymentStatus paid
        createOrderDto.status = OrderStatus.COMPLETED;
        createOrderDto.paymentStatus = PaymentStatus.PAID;
        // items status completed, exporter and exportedAt
        createOrderDto.items = createOrderDto.items.map((item) => ({
          ...item,
          status: OrderStatus.COMPLETED,
          exporter: createdBy,
          exportedAt: new Date(),
        }));
      }
      if (createOrderDto.orderExport === OrderExport.NORMAL) {
        // checker and cashier same as createdBy
        createOrderDto.checker = createdBy;
        createOrderDto.cashier = createdBy;
        // status confirmed and paymentStatus paid
        createOrderDto.status = OrderStatus.CONFIRMED;
        createOrderDto.paymentStatus = PaymentStatus.PAID;
        // items status confirmed
        createOrderDto.items = createOrderDto.items.map((item) => ({
          ...item,
          status: OrderStatus.CONFIRMED,
        }));
      }
      // if (createOrderDto.orderExport === OrderExport.RECEPT) {
      //   // status pending and paymentStatus unpaid
      //   createOrderDto.status = OrderStatus.PENDING;
      //   createOrderDto.paymentStatus = PaymentStatus.UNPAID;
      // }
    }

    if (createOrderDto.orderType === OrderType.DELIVERY) {
      createOrderDto.trackingNumber = `delivery-${Date.now()}`;
      createOrderDto.status = OrderStatus.CONFIRMED;
      createOrderDto.items = createOrderDto.items.map((item) => ({
        ...item,
        exporter:
          createOrderDto.orderExport === OrderExport.QUICK
            ? createdBy
            : undefined,
        exportedAt:
          createOrderDto.orderExport === OrderExport.QUICK
            ? new Date()
            : undefined,
        status:
          createOrderDto.orderExport === OrderExport.NORMAL
            ? OrderStatus.CONFIRMED
            : OrderStatus.COMPLETED,
      }));
    }

    if (createOrderDto.orderType === OrderType.WEBSITE) {
      // default payment method cash, paymentStatus unpaid, status pending
      createOrderDto.trackingNumber = `website-${Date.now()}`;
      createOrderDto.status = OrderStatus.PENDING;
      createOrderDto.paymentMethod = PaymentMethod.CASH;
      createOrderDto.paymentStatus = PaymentStatus.UNPAID;
      createOrderDto.orderExport = OrderExport.NORMAL;
      createOrderDto.customerPay = 0;
      createOrderDto.customerPayCod =
        totalAmount - (createOrderDto?.customerPay || 0);
    }

    try {
      // Validate that all products exist and are available
      for (const item of createOrderDto.items) {
        const product = await this.productModel.findById(item.product).exec();
        if (!product) {
          this.logger.warn(`Product with ID ${item.product} not found`);
          throw new NotFoundException(
            `Product with ID ${item.product} not found`,
          );
        }
        if (!product.isAvailable) {
          this.logger.warn(`Product ${product.name} is not available`);
          throw new BadRequestException(
            `Product ${product.name} is not available`,
          );
        }
        if (product.stock < item.quantity) {
          this.logger.warn(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          );
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }
      }

      if (createOrderDto.orderType === OrderType.DELIVERY) {
        const status = OrderExport.QUICK
          ? OrderStatus.COMPLETED
          : OrderStatus.CONFIRMED;
        const cod = totalAmount - (createOrderDto?.customerPay || 0);
        createOrderDto.trackingNumber = `delivery-${Date.now()}`;
        createOrderDto.status = status;
        createOrderDto.customerPayCod = cod;
        createOrderDto.paymentStatus =
          cod === 0 ? PaymentStatus.PAID : PaymentStatus.UNPAID;
        // checker, cashier, exporter all same as createdBy
        createOrderDto.checker = createdBy;
        createOrderDto.cashier = createdBy;
        createOrderDto.exporter = createdBy;
        // items status completed, exporter and exportedAt
        createOrderDto.items = createOrderDto.items.map((item) => ({
          ...item,
          status,
          exporter: status === OrderStatus.COMPLETED ? createdBy : undefined,
          exportedAt: status === OrderStatus.COMPLETED ? new Date() : undefined,
        }));
      }

      const order = new this.orderModel({
        ...createOrderDto,
        subTotal,
        totalAmount,
      });
      const savedOrder = await order.save();

      if (
        //order.orderType === OrderType.IN_STORE &&
        order.orderExport === OrderExport.QUICK
      ) {
        // Update product stock
        for (const item of createOrderDto.items) {
          await this.productModel.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      const createdOrder = await this.findOne(savedOrder._id);

      // Emit real-time event for order creation
      this.orderGateway.emitOrderCreated(createdOrder);
      this.logger.debug(
        `Order creation event emitted for ID: ${createdOrder._id}`,
      );

      return createdOrder;
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  //findAll optional by from-to date range
  async findAll(
    fromDate?: string,
    toDate?: string,
    status?: string,
  ): Promise<Order[]> {
    const statusArray = status ? status.split(',') : [];
    try {
      const query: any = {
        ...(statusArray.length > 0 ? { status: { $in: statusArray } } : {}),
      };
      // Add date range filter if provided
      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) {
          query.createdAt.$gte = new Date(fromDate + 'T00:00:00.000Z');
          this.logger.debug(`Filter from date: ${fromDate}`);
        }
        if (toDate) {
          query.createdAt.$lte = new Date(toDate + 'T23:59:59.999Z');
          this.logger.debug(`Filter to date: ${toDate}`);
        }
      }

      const orders = await this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .exec();
      this.logger.debug(`Retrieved ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch all orders: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    this.logger.log(`Fetching orders with status: ${status}`);
    try {
      const orders = await this.orderModel
        .find({ status })
        .populate({
          path: 'items.product',
          populate: {
            path: 'category',
          },
        })
        .sort({ createdAt: -1 })
        .exec();
      this.logger.debug(
        `Retrieved ${orders.length} orders with status ${status}`,
      );
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch orders by status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByCustomer(customerEmail: string): Promise<Order[]> {
    this.logger.log(`Fetching orders for customer: ${customerEmail}`);
    try {
      const orders = await this.orderModel
        .find({ customerEmail })
        .populate({
          path: 'items.product',
          populate: {
            path: 'category',
          },
        })
        .sort({ createdAt: -1 })
        .exec();
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderModel
        .findById(id)

        .lean()
        .exec();

      if (!order) {
        this.logger.warn(`Order with ID ${id} not found`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, data: any, userId?: string): Promise<Order> {
    const updateOrderDto: any = data;
    this.logger.log(`Updating order with ID: ${id}`);
    try {
      // If updating items, validate products again
      if (updateOrderDto.items) {
        for (const item of updateOrderDto.items) {
          const product = await this.productModel.findById(item.product).exec();
          if (!product) {
            this.logger.warn(
              `Product with ID ${item.product} not found during update`,
            );
            throw new NotFoundException(
              `Product with ID ${item.product} not found`,
            );
          }
        }
      }

      const { subTotal, totalAmount } = await this.calculateOrderTotals(
        updateOrderDto as any,
      );

      const order = await this.orderModel
        .findByIdAndUpdate(
          id,
          { ...updateOrderDto, subTotal, totalAmount },
          { new: true },
        )

        .exec();

      if (!order) {
        this.logger.warn(`Order with ID ${id} not found during update`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order updated successfully: ${id}`);
      this.orderGateway.emitOrderUpdated(order);
      this.logger.debug(`Order update event emitted for ID: ${id}`);

      return order;
    } catch (error) {
      this.logger.error(
        `Failed to update order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    userId: string,
    update: Partial<Order> = {},
  ): Promise<Order> {
    this.logger.log(`Updating order status to ${status} for ID: ${id}`);
    try {
      // find order for get items
      const order = await this.orderModel.findById(id).lean().exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // // process pay cod when status is delivered
      // if (status === OrderStatus.DELIVERED) {
      //   update.paymentStatus = PaymentStatus.PAID;
      //   update.deliveryBy = status === OrderStatus.DELIVERED ? userId : '';
      //   update.deliveredAt =
      //     status === OrderStatus.DELIVERED ? new Date() : null;
      // }

      // update status and items status, set exporter and exportedAt if exported
      const updated = await this.orderModel
        .findByIdAndUpdate(
          id,
          {
            status,
            items: order.items.map((item) => ({
              ...item,
              status,
              exporter: status === OrderStatus.EXPORTED ? userId : '', // TODO: set actual user performing the export
              exportedAt: status === OrderStatus.EXPORTED ? new Date() : null,
            })),
            ...update,
          },
          { new: true },
        )
        .exec();

      if (!updated) {
        this.logger.warn(`Order with ID ${id} not found during status update`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order status updated to ${status}: ${id}`);

      this.orderGateway.emitOrderStatusUpdated(updated);
      console.log('emitted order status update');
      this.logger.debug(`Order status update event emitted for ID: ${id}`);

      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update order status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // cancel order confirm
  async cancelStatus(
    id: string,
    status: OrderStatus,
    userId: string,
  ): Promise<Order> {
    // update order status to pending, update items status to pending
    try {
      const order = await this.orderModel.findById(id).lean().exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      //check inputStatus and  check current status

      // Only allow cancellation of == OrderStatus.CONFIRMED orders
      if (order.status === OrderStatus.CONFIRMED) {
        // Update product stock
        for (const item of order.items) {
          await this.productModel.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }

      const cancelledOrder = await this.orderModel
        .findByIdAndUpdate(
          id,
          {
            status: status,
            items: order.items.map((item) => ({
              ...item,
              status: status,
            })),
          },
          { new: true },
        )
        .exec();

      this.orderGateway.emitOrderStatusUpdated(cancelledOrder);
      return cancelledOrder;
    } catch (error) {
      this.logger.error(
        `Failed to cancel order confirmation: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing order with ID: ${id}`);
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        this.logger.warn(`Order with ID ${id} not found`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // Only allow deletion of pending or cancelled orders
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.CANCELLED
      ) {
        this.logger.warn(
          `Cannot delete order ${id} with status ${order.status}. Only pending or cancelled orders can be deleted.`,
        );
        throw new BadRequestException(
          `Cannot delete order with status ${order.status}. Only pending or cancelled orders can be deleted.`,
        );
      }

      // If deleting a pending order, restore product stock
      if (order.status === OrderStatus.PENDING) {
        for (const item of order.items) {
          await this.productModel.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        this.logger.debug(`Product stock restored for order: ${id}`);
      }

      await this.orderModel.findByIdAndDelete(id).exec();
      this.logger.log(`Order deleted successfully: ${id}`);

      // Emit real-time event for order deletion
      this.orderGateway.emitOrderDeleted(id);
      this.logger.debug(`Order deletion event emitted for ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to remove order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
