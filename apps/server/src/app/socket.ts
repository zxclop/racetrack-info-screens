import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { registerAuthGateway } from '../modules/auth/auth.gateway';
import { registerRaceControlGateway } from '../modules/race-control/race-control.gateway';

const FRONTEND_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];

export const buildSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (_origin, callback) => {
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  registerAuthGateway(io);
  registerRaceControlGateway(io);

  return io;
};
