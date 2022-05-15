import { ServerConfig, DatabaseSchema, OptionalDatabaseSchema } from './types';

export const config: ServerConfig = {
  baseUrl: 'http://localhost',
  api: { port: 3000 },
  socket: { port: 8080 },
  client: { port: 1234 },
};

export const db: DatabaseSchema = {
  users: {
    'one@foo.com': {
      email: 'one@foo.com',
      password: 'foo',
      name: 'Juan Pablo',
      userId: 'user_64f47b36-9873-4847-8426-623f8978b7a9',
      teamId: 'team_0432bfa9-e811-43f4-93b6-908db2674802',
    },
    'two@foo.com': {
      email: 'two@foo.com',
      password: 'foo',
      name: 'Terry Smith',
      userId: 'user_bfd6afb4-f9d3-41d3-bcb9-887c9a648f6e',
      teamId: 'team_0432bfa9-e811-43f4-93b6-908db2674802',
    },
    'one@bar.com': {
      email: 'one@bar.com',
      password: 'bar',
      name: 'Shruti Kapoor',
      userId: 'user_11758d90-d02b-4e86-a037-7994f66a58c9',
      teamId: 'team_8b3b31af-0d57-4a58-91b6-16a92f85b336',
    },
    'two@bar.com': {
      email: 'two@bar.com',
      password: 'bar',
      name: 'Fluffy Hernandez',
      userId: 'user_5ab90d97-8efe-49cc-af3c-cbc1c571cf16',
      teamId: 'team_8b3b31af-0d57-4a58-91b6-16a92f85b336',
    },
  },
  userIdMap: {
    'user_64f47b36-9873-4847-8426-623f8978b7a9': 'one@foo.com',
    'user_bfd6afb4-f9d3-41d3-bcb9-887c9a648f6e': 'two@foo.com',
    'user_11758d90-d02b-4e86-a037-7994f66a58c9': 'one@bar.com',
    'user_5ab90d97-8efe-49cc-af3c-cbc1c571cf16': 'two@bar.com',
  },
  teams: {
    'team_0432bfa9-e811-43f4-93b6-908db2674802': {
      teamId: 'team_0432bfa9-e811-43f4-93b6-908db2674802',
      name: 'Pink Foxes',
      projectIds: [
        'project_19a96c72-5e60-4b45-a05e-deecd5109ec6',
        'project_c4bf4477-6490-47b0-85cd-21fd82624524',
      ],
    },
    'team_8b3b31af-0d57-4a58-91b6-16a92f85b336': {
      teamId: 'team_8b3b31af-0d57-4a58-91b6-16a92f85b336',
      name: 'Chubby Metropolitans',
      projectIds: [
        'project_99832362-3db0-4f6b-b7e6-887de03e4ac3',
      ],
    },
  },
  projects: {
    'project_19a96c72-5e60-4b45-a05e-deecd5109ec6': {
      name: 'Wales Ostriches Bridge Construction',
      projectId: 'project_19a96c72-5e60-4b45-a05e-deecd5109ec6',
      status: 'IN_PROGRESS',
    },
    'project_c4bf4477-6490-47b0-85cd-21fd82624524': {
      name: 'Ginger Guppies Web App Timeline',
      projectId: 'project_c4bf4477-6490-47b0-85cd-21fd82624524',
      status: 'PENDING',
    },
    'project_99832362-3db0-4f6b-b7e6-887de03e4ac3': {
      name: 'Brunette Giraffes Home Remodel',
      projectId: 'project_99832362-3db0-4f6b-b7e6-887de03e4ac3',
      status: 'COMPLETE',
    },
  },
  sessions: {},
  socketClients: {},
  socketRooms: {},
};

export class Database {
  db: DatabaseSchema

  constructor(dbInit: DatabaseSchema) {
    this.db = dbInit;
  }

  get = () => {
    return this.db;
  }

  set = ({
    users,
    userIdMap,
    teams,
    projects,
    sessions,
    socketClients,
    socketRooms,
  }: OptionalDatabaseSchema) => {
    if (users) this.db.users = users;
    if (userIdMap) this.db.userIdMap = userIdMap;
    if (teams) this.db.teams = teams;
    if (projects) this.db.projects = projects;
    if (sessions) this.db.sessions = sessions;
    if (socketClients) this.db.socketClients = socketClients;
    if (socketRooms) this.db.socketRooms = socketRooms;
  }
}
