import io, { Socket } from 'socket.io-client';
import config from '../config';
import { User } from '../types/baseTypes';

export function getSocket(user: User): Socket {
  const socket = io(config.socketBaseUrl, {
    withCredentials: true,
    auth: { user },
  });
  return socket;
}
