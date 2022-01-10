import ClientEventBroadcaster from '../../event-broadcaster/client';
import {
  Event,
  EventUserCreate,
  EventUserUpdate,
  EventUserDelete,
  EventGetUsers,
  EventWithContext,
} from '../../../shared/types/eventTypes';
import { ServiceHandler, usersStore } from '../index';

export const serviceHandler: ServiceHandler = (
  eventWithCtx: EventWithContext,
  clientBroadcaster: ClientEventBroadcaster,
) => {
  const eventIn: Event = eventWithCtx.event;

  switch (eventIn.type) {
    case 'USER_CREATE': {
      const event: EventUserCreate = eventIn;

      usersStore[event.data.id] = event.data;

      const eventOut: EventGetUsers = {
        type: 'GET_USERS',
        data: {
          users: usersStore,
        },
      };
      clientBroadcaster.broadcast(eventOut);
      break;
    }
    case 'USER_UPDATE': {
      const event: EventUserUpdate = eventIn;

      usersStore[event.data.id] = {
        ...usersStore[event.data.id],
        ...(event.data.teamId ? { teamId: event.data.teamId } : {}),
        ...(event.data.name ? { name: event.data.name } : {}),
      };

      const eventOut: EventGetUsers = {
        type: 'GET_USERS',
        data: {
          users: usersStore,
        },
      };
      clientBroadcaster.broadcast(eventOut);
      break;
    }
    case 'USER_DELETE': {
      const event: EventUserDelete = eventIn;

      delete usersStore[event.data.id];

      const eventOut: EventGetUsers = {
        type: 'GET_USERS',
        data: {
          users: usersStore,
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
