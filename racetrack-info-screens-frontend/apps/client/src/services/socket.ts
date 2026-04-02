import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  autoConnect: false,
});

export function setSocketAuth(key: string, role: string) {
  socket.auth = { key, role };
}

export { SERVER_URL };
