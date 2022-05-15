import { Express } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Database } from './constants';
import { ServerConfig, SessionSchema, WrappedTypedEvent } from './types';
import { isValidEvent, getUser, getUserSession, validateUserSession } from './utils';

export default class Broadcaster {
  io: Server;
  database: Database;
  logger: (data: any) => void;

  constructor(app: Express, config: ServerConfig, database: Database) {
    this.logger = console.log;
    this.database = database;
    const httpServer = createServer(app);

    this.io = new Server(httpServer, {
      cors: {
        origin: `${config.baseUrl}:${config.client.port}`,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.listen(config.socket.port);

    this.io.use((socket: Socket, next: (err?: Error) => void) => {
      const userId: string = socket.handshake.auth?.user?.userId;
      if (!userId) {
        next(new Error('Unauthenticated connection is not supported'));
      }

      const user = getUser(userId, this.database);
      if (!user) {
        next(new Error(`User ${userId} does not exist`));
      }

      const session = getUserSession(userId, this.database);
      if (!session) {
        next(new Error('Could not broadcast for non-existent session'));
        return; // this is required to proceed
      }

      try {
        const { sessions } = this.database.get();
        validateUserSession(
          sessions,
          userId,
          session.sessionId,
        );
      } catch (e) {
        const error = e instanceof Error ? e : new Error('Could not validate user session');
        next(error);
      }

      next();
    });

    this.io.on('connection', (socket: Socket) => {
      const userId: string = socket.handshake.auth?.user?.userId;
      if (!userId) throw new Error('No user passed from middleware');

      const user = getUser(userId, this.database);
      if (!user) throw new Error(`No user with id: ${userId}`);

      const { teamId } = user;
      socket.join(teamId);

      const { socketRooms } = this.database.get();
      const existingRoom = socketRooms[teamId];
      const updatedRoom = existingRoom
        ? { ...existingRoom, [userId]: socket.id }
        : { [userId]: socket.id };

      socketRooms[teamId] = updatedRoom;
      this.database.set({ socketRooms });

      this.logger(socketRooms);

      this.io.on('disconnect', () => {
        const { socketRooms: newSocketRooms } = this.database.get();
        const newExistingRoom = newSocketRooms[teamId];
        delete newExistingRoom[userId];
        this.database.set({ socketRooms: newSocketRooms });
      });
    });
  }

  broadcast(wrappedEvent: WrappedTypedEvent<any>) {
    const { userId, event } = wrappedEvent;

    const user = getUser(userId, this.database);
    if (!user) return;

    console.log({ event });
    if (isValidEvent(event)) {
      console.log({ event, valid: true });
      this.io.to(user.teamId).emit(event.type, event);
    }
  }

  disconnect(userId: string) {
    const user = getUser(userId, this.database);
    if (!user) return;

    const { socketRooms } = this.database.get();
    const newExistingRoom = socketRooms[user.teamId];
    delete newExistingRoom[userId];
    this.database.set({ socketRooms });
  }
}
