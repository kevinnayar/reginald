import express, { Request, Response} from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import ServerEventBroadcaster from './event-broadcaster/server';
import ClientEventBroadcaster from './event-broadcaster/client';
import { EventTeamCreate, EventUserCreate } from '../shared/types/eventTypes';

export type ConfigType = {
  baseUrl: string;
  api: { port: number };
  socket: { port: number };
  client: { port: number };
};

const config: ConfigType = {
  baseUrl: 'http://localhost',
  api: { port: 3000 },
  socket: { port: 8080 },
  client: { port: 1234 },
};

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(
  cors({
    origin: [`${config.baseUrl}:${config.client.port}`],
    credentials: true,
  }),
);

const serverBroadcaster = new ServerEventBroadcaster();
const clientBroadcaster = new ClientEventBroadcaster(app, config);

function createTeam(req: Request, res: Response) {
  const name: string = req.body.name;

  const event: EventTeamCreate = {
    type: 'TEAM_CREATE',
    data: {
      id: `team_${v4()}`,
      name,
    },
  };
  serverBroadcaster.broadcast(event, clientBroadcaster);

  res.status(200).send({ statusText: 'OK' });
}

function createUser(req: Request, res: Response) {
  const name: string = req.body.name;
  const teamId: string = req.body.teamId;

  const event: EventUserCreate = {
    type: 'USER_CREATE',
    data: {
      id: `user_${v4()}`,
      name,
      teamId,
    },
  };
  serverBroadcaster.broadcast(event, clientBroadcaster);

  res.status(200).send({ statusText: 'OK' });
}

app.post('/api/v1/teams', createTeam);
app.post('/api/v1/users', createUser);
app.listen(config.api.port, () => {
  console.log(`api server running at ${config.baseUrl}:${config.api.port}`);
});




// const io = socketIo(app, baseUrl, socketPort, uiPort);



// io.on('connection', (socket: Socket) => {
//   // eventEmitter.on('SERVER_RETURN_EVENT', (event) => {
//   // socket.emit('SERVER_RETURN_EVENT', event);
//   // });
// });


// function handleEvent(req: Request, res: Response) {
//   const { event: eventUntyped } = req.body;

//   if (!isSupportedEvent(eventUntyped)) {
//     throw new Error(`Unsupported event type: "${eventUntyped.type || 'UNKNOWN'}"`);
//   }

//   const event: Event = eventUntyped;
//   eventEmitter.emit('SERVICE_EVENT', event);

//   res.status(200).send({ statusText: 'OK', event });
// }

// app.post('/api/v1/events/write', handleEvent);



