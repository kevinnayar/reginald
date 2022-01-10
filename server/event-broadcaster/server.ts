import { openSync, closeSync, appendFileSync } from 'fs';
import path from 'path';
import ClientEventBroadcaster from './client';
import { getServiceHandlers, ServiceHandler } from '../services';
import { isValidServerEvent, wrapEventWithContext } from '../../shared/utils/eventUtils';
import { Event, EventWithContext } from '../../shared/types/eventTypes';

function appendToEventLog(filePath: string, eventWithCtx: EventWithContext) {
  let fileDesc: undefined | number;
  try {
    fileDesc = openSync(path.join(__dirname, filePath), 'a');
    appendFileSync(fileDesc, JSON.stringify(eventWithCtx, null, 2), 'utf8');
  } catch (err) {
    console.log('Error writing to event log');
    console.error(err);
  } finally {
    if (fileDesc !== undefined) closeSync(fileDesc);
  }
}

export default class ServerEventBroadcaster {
  serviceHandlers: ServiceHandler[];

  constructor() {
    this.serviceHandlers = getServiceHandlers();
  }

  broadcast(event: Event, clientBroadcaster: ClientEventBroadcaster) {
    if (!isValidServerEvent(event)) {
      throw new Error(`Unsupported server event type: "${event.type}"`);
    }

    const eventWithCtx: EventWithContext = wrapEventWithContext(event);

    appendToEventLog('./logs/event-log.txt', eventWithCtx);

    for (const serviceHandler of this.serviceHandlers) {
      serviceHandler(eventWithCtx, clientBroadcaster);
    }
  }
}
