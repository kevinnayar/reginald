import { v4 } from 'uuid';
import {
  SessionSchema,
  UserSchema,
  TypedEvent,
  WrappedTypedEvent,
  EVENT_TYPES,
} from './types';
import { Database } from './constants';

export function getUuid(prefix?: string) {
  return prefix ? `${prefix}_${v4()}` : v4();
}

export function getUTCTimestampPlusDays(days: number) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.getTime();
}

export function sanitizeUser(user: UserSchema): Omit<UserSchema, 'password'> {
  const { email, name, userId, teamId } = user;
  return { email, name, userId, teamId };
}

export function wrapEvent<T>(event: TypedEvent<T>, userId: string): WrappedTypedEvent<T> {
  return {
    userId,
    utcTimestamp: Date.now(),
    event,
  };
}

export function isValidEvent(event: any): boolean {
  if (typeof event.type !== 'string') return false;
  return EVENT_TYPES.includes(event.type);
}

export function getUser(userId: string, database: Database): UserSchema | undefined {
  const { userIdMap, users } = database.get();
  const emailMaybe = userIdMap[userId];
  const userMaybe = users[emailMaybe || ''];
  return userMaybe;
}

export function getUserSession(userId: string, database: Database): SessionSchema | undefined {
  const { sessions } = database.get();
  const session = sessions[userId];
  return session;
}


export function validateUserSession(sessions: Record<string, SessionSchema>, userId: string, sessionId: string) {
  const session = sessions[userId];

  if (!session || session.sessionId !== sessionId || session.userId !== userId) {
    throw new Error('User is not logged in');
  }

  if (Date.now() > session.expiresAt) {
    throw new Error('User session has expired');
  }
}


