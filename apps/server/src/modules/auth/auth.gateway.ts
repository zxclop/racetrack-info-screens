import type { Server } from "socket.io"
import { authService } from "./auth.service"

export const registerAuthGateway = (io: Server) => {
  io.use((socket, next) => {
    try {
      socket.data.authUser = authService.authenticateSocket(socket)
      next()
    } catch (error) {
      setTimeout(() => {
        next(error instanceof Error ? error : new Error("Authentication failed"))
      }, authService.getInvalidAuthDelayMs())
    }
  })
}
