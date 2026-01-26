import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'receptions',
  transports: ['websocket'],
  cors: {
    origin: process.env.CORS_ORIGIN?.split(';')
      .map((o) => o.trim())
      .filter(Boolean) || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4200',
    ],
    credentials: true,
  },
})
export class ReceptionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ReceptionGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to receptions namespace: ${client.id}`);

    // Join client to receptions room for broadcasting
    client.join('receptions');

    // Send welcome message
    client.emit('connected', {
      message: 'Connected to receptions updates',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client disconnected from receptions namespace: ${client.id}`,
    );
  }

  // Method to emit reception created event
  emitReceptionCreated(reception: any) {
    this.server.to('receptions').emit('reception:created', {
      event: 'reception:created',
      data: reception,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Reception created event emitted: ${reception._id}`);
  }

  // Method to emit reception updated event
  emitReceptionUpdated(reception: any) {
    this.server.to('receptions').emit('reception:updated', {
      event: 'reception:updated',
      data: reception,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Reception updated event emitted: ${reception._id}`);
  }

  // Method to emit reception deleted event
  emitReceptionDeleted(receptionId: string) {
    this.server.to('receptions').emit('reception:deleted', {
      event: 'reception:deleted',
      data: { receptionId },
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Reception deleted event emitted: ${receptionId}`);
  }

  // Method to emit reception status toggled event
  emitReceptionStatusToggled(reception: any) {
    this.server.to('receptions').emit('reception:status-toggled', {
      event: 'reception:status-toggled',
      data: reception,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Reception status toggled event emitted: ${reception._id}`);
  }
}
