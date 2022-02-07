import { v4 } from 'uuid';
import {
  serverEventTypeRegister,
  clientEventTypeRegister,
  Event,
  EventWithContext,
} from '../types/eventTypes';

export function isValidServerEvent(event: any): boolean {
  if (!event || !event.data || !event.type) return false;
  return Boolean(serverEventTypeRegister[event.type]);
}

export function isValidClientEvent(event: any): boolean {
  if (!event || !event.data || !event.type) return false;
  return Boolean(clientEventTypeRegister[event.type]);
}

export function isValidEvent(event: any): boolean {
  return isValidServerEvent(event) || isValidClientEvent(event);
}

export function wrapEventWithContext(event: Event): EventWithContext {
  const eventWithCtx: EventWithContext = {
    utcTimestamp: Date.now(),
    eventId: `event_${v4()}`,
    event,
  };
  return eventWithCtx;
}


