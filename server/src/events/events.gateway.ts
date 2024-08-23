import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'], cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }
}
