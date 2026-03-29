import type { Server as HttpServer } from "http"
import { Server } from "socket.io"
import { registerRaceGateway } from "../modules/race-control/race.gateway"
import { registerRaceControlGateway } from "../modules/race-control/race-control.gateway"

export const buildSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  })

    registerRaceGateway(io),
    registerRaceControlGateway(io)

  return io
}