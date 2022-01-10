import { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ConfigType } from '../index';
import { isValidClientEvent } from '../../shared/utils/eventUtils';
import { Event } from '../../shared/types/eventTypes';

export default class ClientEventBroadcaster {
  io: Server;

  constructor(app: Express, config: ConfigType) {
    const httpServer = createServer(app);
    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.baseUrl}:${config.client.port}`,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.io.listen(config.socket.port);
  }

  broadcast(event: Event) {
    if (!isValidClientEvent(event)) {
      throw new Error(`Unsupported client event type: "${event.type}"`);
    }
    this.io.emit(event.type, event);
  }
}


