import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'orders',
  cors: {
    origin: [],
    credentials: true,
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrderGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to orders namespace: ${client.id}`);

    // Join client to orders room for broadcasting
    client.join('orders');

    // Send welcome message
    client.emit('connected', {
      message: 'Connected to orders updates',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from orders namespace: ${client.id}`);
  }

  // Method to emit order created event
  emitOrderCreated(order: any) {
    this.server.to('orders').emit('order:created', {
      event: 'order:created',
      data: order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Order created event emitted: ${order._id}`);
  }

  // Method to emit order updated event
  emitOrderUpdated(order: any) {
    this.server.to('orders').emit('order:updated', {
      event: 'order:updated',
      data: order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Order updated event emitted: ${order._id}`);
  }

  // Method to emit order status updated event
  emitOrderStatusUpdated(order: any) {
    console.log('emitting order status update for order');
    this.server.to('orders').emit('order:status-updated', {
      event: 'order:status-updated',
      data: order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Order status updated event emitted: ${order._id}`);
  }

  // Method to emit order cancelled event
  emitOrderCancelled(order: any) {
    this.server.to('orders').emit('order:cancelled', {
      event: 'order:cancelled',
      data: order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Order cancelled event emitted: ${order._id}`);
  }

  // Method to emit order deleted event
  emitOrderDeleted(orderId: string) {
    this.server.to('orders').emit('order:deleted', {
      event: 'order:deleted',
      data: { orderId },
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Order deleted event emitted: ${orderId}`);
  }
}
