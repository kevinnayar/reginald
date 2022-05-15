import express, { NextFunction, Request, Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Broadcaster from './broadcaster';
import {
  getUuid,
  getUTCTimestampPlusDays,
  sanitizeUser,
  validateUserSession,
  wrapEvent,
  getUser,
} from './utils';
import {
  ProjectSchema,
  SessionSchema,
  Status,
  EventType,
  TypedEvent,
} from './types';
import { Database, db, config } from './constants';
import { getErrorMessage } from '../shared/utils/errorUtils';

interface $Request extends Request { userId?: string }

interface $Error extends Error { code?: number }

const app = express();

app.use(express.json());

app.use(cookieParser());

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

const database = new Database(db);
const broadcaster = new Broadcaster(app, config, database);

function userLogin(req: Request, res: Response) {
  const email = req.body.email;

  const { users, sessions } = database.get();
  const user = users[email];
  if (!user) throw new Error('Incorrect email or password');

  const password = req.body.password;
  if (password !== user.password) throw new Error('Incorrect email or password');

  const session: SessionSchema = {
    userId: user.userId,
    sessionId: getUuid('session'),
    expiresAt: getUTCTimestampPlusDays(30),
  };

  sessions[user.userId] = session;
  database.set({ sessions });

  const cookieOpts = {
    path: '/api/v1',
    httpOnly: true,
  };
  res.cookie('SessionId', session.sessionId, cookieOpts);
  res.cookie('UserId', session.userId, cookieOpts);

  res.status(200).send(sanitizeUser(user));
}

function userLogout(req: Request, res: Response) {
  const email = req.body.email;

  const { users, sessions } = database.get();
  const user = users[email];
  if (!user) {
    res.status(200).send({ logout: true });
  }

  delete sessions[user.userId];
  database.set({ sessions });
  broadcaster.disconnect(user.userId);

  res.status(200).send({ logout: true });
}

function requireAuth(req: $Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies.SessionId || req.body.sessionId;
  const userId = req.cookies.UserId || req.body.userId;
  const { sessions } = database.get();

  try {
    validateUserSession(sessions, userId, sessionId);
    req.userId = userId;
    next();
  } catch (e) {
    /// @ts-ignore
    if (typeof e === 'object' && e !== null) e.code = 403;
    next(e);
  }
}

function getSelf(req: $Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    throw new Error('User is not authenticated!');
  }

  const user = getUser(userId, database);
  if (!user) {
    throw new Error('User is not authenticated!');
  }

  res.status(200).send(sanitizeUser(user));
}

function getProjects(req: $Request, res: Response) {
  const userId = req.userId;
  if (!userId) throw new Error('User ID is invalid');

  const { userIdMap, users, teams, projects } = database.get();
  const email = userIdMap[userId];
  const user = users[email];
  if (!user) throw new Error('User does not exist');

  const team = teams[user.teamId];
  if (!team) throw new Error('User is not on a team');

  const userProjects: ProjectSchema[] = [];
  for (const id of team.projectIds) {
    const project = projects[id];
    userProjects.push(project);
  }

  res.status(200).send(userProjects);
}

function createProject(req: $Request, res: Response) {
  const userId = req.userId;
  if (!userId) throw new Error('User ID is invalid');

  const projectId = getUuid('project');
  const name = req.body.name;
  const status = req.body.status as Status;

  if (!name && !status) {
    throw new Error('No changes!');
  }

  const { projects } = database.get();

  const data: ProjectSchema = {
    projectId,
    name,
    status,
  };
  projects[projectId] = data;
  database.set({ projects });

  const event: TypedEvent<ProjectSchema> = {
    type: 'event-project-create' as EventType,
    data,
  };

  broadcaster.broadcast(wrapEvent(event, userId));

  res.status(200).send({ eventAccepted: true });
}

function updateProject(req: $Request, res: Response) {
  const userId = req.userId;
  if (!userId) throw new Error('User ID is invalid');

  const projectId = req.params.projectId;
  const nameMaybe = req.body.name;
  const statusMaybe = req.body.status as undefined | Status;

  if (!nameMaybe && !statusMaybe) {
    throw new Error('No changes!');
  }

  const { projects } = database.get();

  const project = projects[projectId];
  if (!project) throw new Error('Project does not exist');

  const data: ProjectSchema = {
    ...project,
    name: nameMaybe || project.name,
    status: statusMaybe || project.status,
  };

  projects[projectId] = data;
  database.set({ projects });

  const event: TypedEvent<ProjectSchema> = {
    type: 'event-project-update' as EventType,
    data,
  };

  broadcaster.broadcast(wrapEvent(event, userId));

  res.status(200).send({ eventAccepted: true });
}

function deleteProject(req: $Request, res: Response) {
  const userId = req.userId;
  if (!userId) throw new Error('User ID is invalid');

  const projectId = req.params.projectId;
  const { projects } = database.get();

  const project = projects[projectId];
  if (!project) throw new Error('Project does not exist');

  delete projects[projectId];
  database.set({ projects });

  const event: TypedEvent<{ id: string }> = {
    type: 'event-project-delete' as EventType,
    data: { id: projectId },
  };

  broadcaster.broadcast(wrapEvent(event, userId));

  res.status(200).send({ eventAccepted: true });
}

app.post('/api/v1/login', userLogin);
app.post('/api/v1/logout', userLogout);

// authed routes
app.get('/api/v1/self', requireAuth, getSelf);

app.get('/api/v1/projects', requireAuth, getProjects);
app.post('/api/v1/projects', requireAuth, createProject);
app.put('/api/v1/projects/:projectId', requireAuth, updateProject);
app.delete('/api/v1/projects/:projectId', requireAuth, deleteProject);

app.use((err: $Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const message = getErrorMessage(err);
  const code = err.code || 500;
  res.status(code).send({ error: true, message });
});

app.listen(
  config.api.port, () => console.log(`api server running at ${config.baseUrl}:${config.api.port}`),
);



