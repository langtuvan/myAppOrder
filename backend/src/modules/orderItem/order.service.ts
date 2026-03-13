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
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from './schemas/order.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderGateway } from './order.gateway';
import {
  Inventory,
  InventoryDocument,
} from '../inventory/schemas/inventory.schema';
import {
  IssueReceiptItem,
  IssueReceiptItemDocument,
} from '../issue_receipt_items';
import {
  IssueReceipt,
  IssueReceiptDocument,
  IssueReceiptsService,
  IssueReceiptStatus,
} from '../issue_receipts';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    private orderGateway: OrderGateway,
    private issueReceiptService: IssueReceiptsService,
  ) {}

  /**
   * Generate tracking number with format: TYPE + YYYYMMDD + auto-incrementing sequence
   * Example: INSTORE20260306001, DELIVER20260306002, WEB20260306001
   */
  private async generateTrackingNumber(orderType: OrderType): Promise<string> {
    // Get type prefix
    const typeMap = {
      [OrderType.IN_STORE]: 'INSTORE',
      [OrderType.DELIVERY]: 'DELIVER',
      [OrderType.WEBSITE]: 'WEB',
    };
    const typePrefix = typeMap[orderType];

    // Get today's date in YYYYMMDD format
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Find the latest tracking number for this type and date
    const regex = new RegExp(`^${typePrefix}-${dateStr}(\\d+)$`);
    const lastOrder = await this.orderModel
      .findOne({ trackingNumber: regex })
      .sort({ createdAt: -1 })
      .exec();

    // Extract sequence number and increment
    let sequence = 1;
    if (lastOrder?.trackingNumber) {
      const match = lastOrder.trackingNumber.match(regex);
      if (match) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    // Pad sequence to 3 digits
    const sequenceStr = String(sequence).padStart(3, '0');
    return `${typePrefix}-${dateStr}${sequenceStr}`;
  }

  /**
   * Deduct stock from inventory based on requested quantity
   * Distributes the deduction across available inventories
   */
  // async deductInventoryStock(
  //   productId: string,
  //   quantity: number,
  //   orderId: string,
  //   inventories: Inventory[],
  // ): Promise<void> {
  //   let remainingQuantity = quantity;
  //   const inventoriesByQuantity = inventories.sort((a, b) => {
  //     const aAvail = a.quantity - a.reservedQuantity;
  //     const bAvail = b.quantity - b.reservedQuantity;
  //     return bAvail - aAvail;
  //   });

  //   for (const inventory of inventoriesByQuantity) {
  //     if (remainingQuantity <= 0) break;

  //     const availableQuantity = inventory.quantity - inventory.reservedQuantity;
  //     const quantityToDeduct = Math.min(remainingQuantity, availableQuantity);

  //     if (quantityToDeduct > 0) {
  //       const beforeQuantity = inventory.quantity;
  //       try {
  //         // Update inventory quantity
  //         // await this.inventoryService.removeStock(
  //         //   inventory._id,
  //         //   quantityToDeduct,
  //         // );

  //         // Create transaction record
  //         // await this.createInventoryTransaction(
  //         //   inventory._id,
  //         //   productId,
  //         //   quantityToDeduct,
  //         //   beforeQuantity,
  //         //   orderId,
  //         //   `Stock deducted for order ${orderId}`,
  //         // );

  //         remainingQuantity -= quantityToDeduct;
  //         this.logger.debug(
  //           `Deducted ${quantityToDeduct} units from inventory ${inventory._id}`,
  //         );
  //       } catch (error: any) {
  //         this.logger.error(
  //           `Failed to deduct stock from inventory ${inventory._id}: ${error.message}`,
  //         );
  //         throw new BadRequestException(
  //           `Failed to process inventory deduction: ${error.message}`,
  //         );
  //       }
  //     }
  //   }
  // }

  async CheckInventoryStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      console.log('Checking inventory for product:', item);
      const inventoryProduct = await this.inventoryModel
        .findOne({ product: item.product })
        .exec();
      if (!inventoryProduct) {
        throw new NotFoundException(
          `Product with ID ${item.product} not found`,
        );
      }

      const availableQuantity = inventoryProduct.quantity - item.quantity; // Assuming reservedQuantity is not considered here

      if (availableQuantity < 0) {
        this.logger.warn(
          `Product with ID ${item.product} is not available in inventory for quantity ${item.quantity}`,
        );
        throw new BadRequestException(
          `Product with ID ${item.product} is not available in inventory for quantity ${item.quantity}`,
        );
      }
    }
  }

  /**
   * Restore inventory stock when order is cancelled
   * Restores stock to the same inventories it was deducted from based on transactions
   */

  /**
   * Calculate subtotal and total amount for an order
   * Subtotal = sum of (quantity * price) for all items
   * Total = subtotal + deliveryPrice - discount
   */

  async create(
    input: Partial<CreateOrderDto>,
    createdBy?: string,
  ): Promise<Order> {
    const createOrderDto = input as Order;
    createOrderDto.customer = createOrderDto?.customer || null;

    // Initialize nested objects if not present
    if (!createOrderDto.billing) {
      createOrderDto.billing = {
        subTotal: 0,
        deliveryPrice: 0,
        discount: 0,
        totalAmount: 0,
        customerPay: 0,
        customerPayCod: 0,
      };
    }
    if (!createOrderDto.payment) {
      createOrderDto.payment = {
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.UNPAID,
        paymentCardNumber: '',
        paymentCode: '',
      };
    }

    if (createOrderDto.orderType === OrderType.IN_STORE) {
      createOrderDto.trackingNumber = await this.generateTrackingNumber(
        OrderType.IN_STORE,
      );
      createOrderDto.payment.paymentStatus = PaymentStatus.PAID;
      if (createOrderDto.orderExport === OrderExport.QUICK) {
        // checker, cashier, exporter all same as createdBy
        createOrderDto.checker = createdBy;
        createOrderDto.cashier = createdBy;
        createOrderDto.exporter = createdBy;
        // status completed and paymentStatus paid
        createOrderDto.status = OrderStatus.COMPLETED;
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
        // items status confirmed
        createOrderDto.items = createOrderDto.items.map((item) => ({
          ...item,
          status: OrderStatus.CONFIRMED,
        }));
      }
    }

    if (createOrderDto.orderType === OrderType.DELIVERY) {
      // check billing if totalAmount = customerPay  set status paid and completed,
      if (
        createOrderDto.billing.totalAmount -
          createOrderDto.billing.customerPay <=
        0
      ) {
        createOrderDto.payment.paymentStatus = PaymentStatus.PAID;
        createOrderDto.status = OrderExport.QUICK
          ? OrderStatus.COMPLETED
          : OrderStatus.CONFIRMED;
      } else if (createOrderDto.billing.customerPayCod > 0) {
        createOrderDto.payment.paymentStatus = PaymentStatus.UNPAID;
        createOrderDto.status = OrderStatus.CONFIRMED;
      }

      createOrderDto.trackingNumber = await this.generateTrackingNumber(
        OrderType.DELIVERY,
      );
      createOrderDto.status =
        createOrderDto.orderExport === OrderExport.QUICK
          ? OrderStatus.COMPLETED
          : OrderStatus.CONFIRMED;
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
      createOrderDto.trackingNumber = await this.generateTrackingNumber(
        OrderType.WEBSITE,
      );
      createOrderDto.status = OrderStatus.PENDING;
    }

    try {
      await this.CheckInventoryStock(createOrderDto.items);

      const order = new this.orderModel({
        ...createOrderDto,
      });

      const savedOrder = await order.save();

      // new IssueReceipt
      if (createOrderDto.orderExport === OrderExport.QUICK) {
        // create issue
        await this.issueReceiptService.create(
          {
            customer: createOrderDto?.customer,
            note: createOrderDto.notes,
            items: createOrderDto.items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              warehouse: '',
              price: item.price,
            })),
          },
          createdBy,
        );
      }

      const createdOrder = await this.findOne(savedOrder._id);

      // Emit real-time event for order creation
      this.orderGateway.emitOrderCreated(createdOrder);
      this.logger.debug(
        `Order creation event emitted for ID: ${createdOrder._id}`,
      );

      return createdOrder;
    } catch (error) {
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
        .populate(['customer'])
        .lean()
        .exec();

      if (!order) {
        this.logger.warn(`Order with ID ${id} not found`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: any, userId?: string): Promise<Order> {
    const updateOrderDto: any = data;

    try {
      // If updating items, validate products again
      await this.CheckInventoryStock(updateOrderDto.items);

      const order = await this.orderModel
        .findByIdAndUpdate(id, { ...updateOrderDto }, { new: true })
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
      throw error;
    }
  }

  async updateStatus(
    id: string,
    toStatus: OrderStatus,
    userId: string,
    update: Partial<Order> = {},
  ): Promise<Order> {
    this.logger.log(`Updating order status to ${toStatus} for ID: ${id}`);
    try {
      // find order for get items
      const order = await this.orderModel.findById(id).lean().exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // check inputStatus and  check current status
      const { status, billing, payment } = order;
      if (status === OrderStatus.PENDING) {
      }
      if (status === OrderStatus.CONFIRMED) {
        await this.CheckInventoryStock(order.items);
      }

      if (status === OrderStatus.EXPORTED && !order.exported) {
        //1. check availabel inventory stock before export
        await this.CheckInventoryStock(order.items);
        // 2. create issue receipt with status pending export, and items status pending export
        await this.issueReceiptService.create(
          {
            customer: order?.customer,
            note: order.notes,
            items: order.items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              warehouse: '',
              price: item.price,
            })),
          },
          userId,
        );
      }
      if (status === OrderStatus.DELIVERED) {
      }
      if (status === OrderStatus.COMPLETED) {
      }
      if (status === OrderStatus.CANCELLED) {
      }
      //update issue when click Export, complete for web or delivry
      // update status and items status, set exporter and exportedAt if exported
      const updated = await this.orderModel
        .findByIdAndUpdate(
          id,
          {
            status: toStatus,
            items: order.items.map((item) => ({
              ...item,
              status: toStatus,
              exporter: toStatus === OrderStatus.EXPORTED ? userId : '', // TODO: set actual user performing the export
              exportedAt: toStatus === OrderStatus.EXPORTED ? new Date() : null,
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

      this.logger.log(`Order status updated to ${toStatus}: ${id}`);

      //this.orderGateway.emitOrderStatusUpdated(updated);
      console.log('emitted order status update');
      this.logger.debug(`Order status update event emitted for ID: ${id}`);

      return updated;
    } catch (error) {
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
        // Restore inventory stock from transaction records
        //await this.restoreInventoryStock(id);
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

      //this.orderGateway.emitOrderStatusUpdated(cancelledOrder);
      return cancelledOrder;
    } catch (error) {
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

      // If deleting a pending order, restore inventory stock from transaction records
      if (order.status === OrderStatus.PENDING) {
        // await this.restoreInventoryStock(id);
        this.logger.debug(`Inventory stock restored for order: ${id}`);
      }

      await this.orderModel.findByIdAndDelete(id).exec();
      this.logger.log(`Order deleted successfully: ${id}`);

      // Emit real-time event for order deletion
      //this.orderGateway.emitOrderDeleted(id);
      this.logger.debug(`Order deletion event emitted for ID: ${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate orders report with revenue breakdown by order type and date range
   */
  async generateReport(startDate: string, endDate: string): Promise<any> {
    try {
      // Parse dates and validate
      const start = new Date(startDate + 'T00:00:00.000Z');
      const end = new Date(endDate + 'T23:59:59.999Z');

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      // Fetch all paid orders in the date range
      const orders = await this.orderModel
        .find({
          createdAt: { $gte: start, $lte: end },
          'payment.paymentStatus': PaymentStatus.PAID,
        })
        .lean()
        .exec();

      // Helper function to calculate order amount
      const orderAmount = (order: any): number => {
        const totalAmount = Number(order?.totalAmount);
        if (!isNaN(totalAmount) && totalAmount > 0) return totalAmount;

        const itemsTotal = (order?.items || []).reduce(
          (sum: number, item: any) => {
            const price = Number(item?.price ?? 0);
            const qty = Number(item?.quantity ?? item?.qty ?? 1);
            return sum + price * qty;
          },
          0,
        );

        const subTotal = Number(order?.billing?.subTotal ?? 0);
        const taxes = Number(order?.billing?.taxes ?? 0);
        const deliveryPrice = Number(order?.billing?.deliveryPrice ?? 0);
        const discount = Number(order?.billing?.discount ?? 0);

        const base = !isNaN(subTotal) && subTotal > 0 ? subTotal : itemsTotal;
        const computed = base + taxes + deliveryPrice - discount;
        return Math.max(0, computed);
      };

      // Helper function to normalize order type
      const normalizeOrderType = (value: any): OrderType => {
        const key = (value ?? OrderType.IN_STORE)
          .toString()
          .toLowerCase()
          .trim();
        if (['website', 'web', 'online'].includes(key))
          return OrderType.WEBSITE;
        if (['delivery', 'ship', 'shipping'].includes(key))
          return OrderType.DELIVERY;
        if (['in_store', 'instore', 'in-store', 'store', 'pos'].includes(key))
          return OrderType.IN_STORE;
        return OrderType.IN_STORE;
      };

      // Build daily buckets
      const buckets: Record<
        string,
        {
          websiteAmount: number;
          inStoreAmount: number;
          deliveryAmount: number;
          websiteCount: number;
          inStoreCount: number;
          deliveryCount: number;
        }
      > = {};

      // Initialize all days in range
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const key = currentDate.toISOString().split('T')[0];
        buckets[key] = {
          websiteAmount: 0,
          inStoreAmount: 0,
          deliveryAmount: 0,
          websiteCount: 0,
          inStoreCount: 0,
          deliveryCount: 0,
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Aggregate order data
      orders.forEach((order: any) => {
        const orderDate = new Date(order?.createdAt);
        const key = orderDate.toISOString().split('T')[0];
        const amount = orderAmount(order);
        const orderType = normalizeOrderType(order?.orderType);

        if (!buckets[key]) {
          buckets[key] = {
            websiteAmount: 0,
            inStoreAmount: 0,
            deliveryAmount: 0,
            websiteCount: 0,
            inStoreCount: 0,
            deliveryCount: 0,
          };
        }

        if (orderType === OrderType.WEBSITE) {
          buckets[key].websiteAmount += amount;
          buckets[key].websiteCount += 1;
        } else if (orderType === OrderType.IN_STORE) {
          buckets[key].inStoreAmount += amount;
          buckets[key].inStoreCount += 1;
        } else if (orderType === OrderType.DELIVERY) {
          buckets[key].deliveryAmount += amount;
          buckets[key].deliveryCount += 1;
        }
      });

      // Build chart data and summary
      const labels: string[] = [];
      const websiteSeries: number[] = [];
      const inStoreSeries: number[] = [];
      const deliverySeries: number[] = [];
      const totals: number[] = [];

      let websiteTotal = 0;
      let inStoreTotal = 0;
      let deliveryTotal = 0;
      let websiteCount = 0;
      let inStoreCount = 0;
      let deliveryCount = 0;
      let bestDayKey = Object.keys(buckets)[0];
      let bestDayTotal = 0;

      // Sort dates and aggregate
      Object.keys(buckets)
        .sort()
        .forEach((key) => {
          const bucket = buckets[key];
          const dateObj = new Date(key);
          const label = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
          });

          labels.push(label);
          websiteSeries.push(bucket.websiteAmount);
          inStoreSeries.push(bucket.inStoreAmount);
          deliverySeries.push(bucket.deliveryAmount);

          const dayTotal =
            bucket.websiteAmount + bucket.inStoreAmount + bucket.deliveryAmount;
          totals.push(dayTotal);

          websiteTotal += bucket.websiteAmount;
          inStoreTotal += bucket.inStoreAmount;
          deliveryTotal += bucket.deliveryAmount;
          websiteCount += bucket.websiteCount;
          inStoreCount += bucket.inStoreCount;
          deliveryCount += bucket.deliveryCount;

          if (dayTotal > bestDayTotal) {
            bestDayKey = key;
            bestDayTotal = dayTotal;
          }
        });

      const daysCount = Object.keys(buckets).length;

      return {
        labels,
        datasets: {
          websiteSeries,
          inStoreSeries,
          deliverySeries,
          totals,
        },
        summary: {
          websiteTotal,
          inStoreTotal,
          deliveryTotal,
          combined: websiteTotal + inStoreTotal + deliveryTotal,
          websiteCount,
          inStoreCount,
          deliveryCount,
          websiteAverage: daysCount > 0 ? websiteTotal / daysCount : 0,
          inStoreAverage: daysCount > 0 ? inStoreTotal / daysCount : 0,
          deliveryAverage: daysCount > 0 ? deliveryTotal / daysCount : 0,
          bestDay: {
            dateKey: bestDayKey,
            total: bestDayTotal,
          },
        },
      };
    } catch (error) {
      this.logger.error('Error generating report:', error);
      throw error;
    }
  }
}
