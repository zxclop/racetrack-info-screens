import type { Server } from 'socket.io';
import { authService } from './auth.service';

export const registerAuthGateway = (io: Server) => {
  io.use((socket, next) => {
    const authPayload =
      typeof socket.handshake.auth === 'object' && socket.handshake.auth
        ? socket.handshake.auth
        : {};

    // Allow unauthenticated connections (public screens)
    if (!authPayload.role && !authPayload.key) {
      next();
      return;
    }

    try {
      socket.data.authUser = authService.authenticateSocket(socket);
      next();
    } catch (error) {
      setTimeout(() => {
        next(
          error instanceof Error ? error : new Error('Authentication failed')
        );
      }, authService.getInvalidAuthDelayMs());
    }
  });
};
