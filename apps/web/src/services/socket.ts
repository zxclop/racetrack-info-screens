import { io } from 'socket.io-client';

const getServerUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  return `${window.location.protocol}//${window.location.hostname}:3001`;
};

export const SERVER_URL = getServerUrl();

export const socket = io(SERVER_URL, {
  autoConnect: false,
});
