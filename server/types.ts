export type ServerConfig = {
  baseUrl: string;
  api: { port: number };
  socket: { port: number };
  client: { port: number };
};

export type UserSchema = {
  email: string;
  password: string;
  name: string;
  userId: string;
  teamId: string;
};

export type TeamSchema = {
  teamId: string;
  name: string;
  projectIds: string[];
};

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE';

export type ProjectSchema = {
  name: string;
  projectId: string;
  status: Status;
};

export type SessionSchema = {
  sessionId: string;
  userId: string;
  expiresAt: number;
};

export type DatabaseSchema = {
  users: Record<string, UserSchema>,
  userIdMap: Record<string, string>,
  teams: Record<string, TeamSchema>,
  projects: Record<string, ProjectSchema>,
  sessions: Record<string, SessionSchema>,
  socketClients: Record<string, string>,
  socketRooms: Record<string, Record<string, string>>,
};

export type OptionalDatabaseSchema = {
  users?: Record <string, UserSchema>,
  userIdMap?: Record <string, string>,
  teams?: Record <string, TeamSchema>,
  projects?: Record <string, ProjectSchema>,
  sessions?: Record <string, SessionSchema>,
  socketClients?: Record <string, string>,
  socketRooms?: Record <string, Record <string, string>>,
};

export const EVENT_TYPES = [
  'event-project-create',
  'event-project-update',
  'event-project-delete',
] as const;

export type EventType = typeof EVENT_TYPES[number];

export type TypedEvent<T> = {
  type: EventType,
  data: T,
};

export type WrappedTypedEvent<T> = {
  userId: string,
  utcTimestamp: number,
  event: TypedEvent<T>,
};

