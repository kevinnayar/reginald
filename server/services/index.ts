import fs from 'fs';
import path from 'path';
import ClientEventBroadcaster from '../event-broadcaster/client';
import { EventWithContext, Team, User } from '../../shared/types/eventTypes';

export const teamsStore: Record<string, Team> = {};
export const usersStore: Record<string, User> = {};

export type ServiceHandler = (
  eventWithCtx: EventWithContext,
  clientBroadcaster: ClientEventBroadcaster,
) => void;

export function getServiceHandlers(): ServiceHandler[] {
  const serviceHandlers: ServiceHandler[] = [];
  const services = fs.readdirSync(path.join(__dirname, './'));

  for (const service of services) {
    // const isDir = fs.lstatSync(filePath).isDirectory();
    // if (path.isDir(service)) {}
    const filePath = path.join(__dirname, `./${service}/index.ts`);

    if (fs.existsSync(filePath)) {
      /* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require */
      const { serviceHandler }: { serviceHandler: ServiceHandler } = require(filePath);
      serviceHandlers.push(serviceHandler);
    }
  }

  if (!serviceHandlers.length) {
    throw new Error('Could not find any services');
  }

  return serviceHandlers;
}
