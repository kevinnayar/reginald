export const serverEventTypeRegister: Record<string, 1> = {
  TEAM_CREATE: 1,
  TEAM_UPDATE: 1,
  TEAM_DELETE: 1,
  USER_CREATE: 1,
  USER_UPDATE: 1,
  USER_DELETE: 1,
};

export const clientEventTypeRegister: Record<string, 1> = {
  GET_TEAMS: 1,
  GET_USERS: 1,
};

export type Team = { name: string; id: string };
export type User = { name: string; id: string; teamId: string };

// EVENTS
export type EventTeamCreate = {
  type: 'TEAM_CREATE';
  data: {
    id: string;
    name: string;
  };
};

export type EventTeamUpdate = {
  type: 'TEAM_UPDATE';
  data: {
    id: string;
    name: string;
  };
};

export type EventTeamDelete = {
  type: 'TEAM_DELETE';
  data: {
    id: string;
  };
};

export type EventGetTeams = {
  type: 'GET_TEAMS';
  data: {
    teams: Record<string, Team>;
  };
};

export type EventUserCreate = {
  type: 'USER_CREATE';
  data: {
    id: string;
    name: string;
    teamId: string;
  };
};

export type EventUserUpdate = {
  type: 'USER_UPDATE';
  data: {
    id: string;
    teamId?: string;
    name?: string;
  };
};

export type EventUserDelete = {
  type: 'USER_DELETE';
  data: {
    id: string;
  };
};

export type EventGetUsers = {
  type: 'GET_USERS';
  data: {
    users: Record<string, User>;
  };
};

export type Event =
  | EventTeamCreate
  | EventTeamUpdate
  | EventTeamDelete
  | EventGetTeams
  | EventUserCreate
  | EventUserUpdate
  | EventUserDelete
  | EventGetUsers;

export type EventWithContext = {
  utcTimestamp: number;
  eventId: string;
  event: Event;
};




