import type { Server as HttpServer } from "http"
import { Server } from "socket.io"
import { registerRaceControlGateway } from "../modules/race-control/race-control.gateway"

const FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
]

export const buildSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_ORIGINS,
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  registerRaceControlGateway(io)

  return io
}