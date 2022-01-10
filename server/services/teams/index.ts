import ClientEventBroadcaster from '../../event-broadcaster/client';
import {
  Event,
  EventTeamCreate,
  EventTeamUpdate,
  EventTeamDelete,
  EventGetTeams,
  EventWithContext,
} from '../../../shared/types/eventTypes';
import { ServiceHandler, teamsStore } from '../index';

export const serviceHandler: ServiceHandler = (
  eventWithCtx: EventWithContext,
  clientBroadcaster: ClientEventBroadcaster,
) => {
  const eventIn: Event = eventWithCtx.event;

  switch (eventIn.type) {
    case 'TEAM_CREATE': {
      const event: EventTeamCreate = eventIn;

      teamsStore[event.data.id] = event.data;

      const eventOut: EventGetTeams = {
        type: 'GET_TEAMS',
        data: {
          teams: teamsStore,
        },
      };
      clientBroadcaster.broadcast(eventOut);
      break;
    }
    case 'TEAM_UPDATE': {
      const event: EventTeamUpdate = eventIn;

      teamsStore[event.data.id] = event.data;

      const eventOut: EventGetTeams = {
        type: 'GET_TEAMS',
        data: {
          teams: teamsStore,
        },
      };
      clientBroadcaster.broadcast(eventOut);
      break;
    }
    case 'TEAM_DELETE': {
      const event: EventTeamDelete = eventIn;

      delete teamsStore[event.data.id];

      const eventOut: EventGetTeams = {
        type: 'GET_TEAMS',
        data: {
          teams: teamsStore,
        },
      };
      clientBroadcaster.broadcast(eventOut);
      break;
    }
    default: {
      // do nothing
    }
  }
};
