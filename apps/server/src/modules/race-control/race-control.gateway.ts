import type { Server } from "socket.io"
import { raceControlService } from "./race-control.service"

export const registerRaceControlGateway = (io: Server) => {
  io.on("connection", (socket) => {
    socket.emit("race-control:state", raceControlService.getCurrentState())

    socket.on("race-control:start", (payload) => {
      const updatedState = raceControlService.startRace(payload)
      io.emit("race-control:state", updatedState)
    })

    socket.on("race-control:set-mode", (payload) => {
      const updatedState = raceControlService.setRaceMode(payload)
      io.emit("race-control:state", updatedState)
    })

    socket.on("race-control:finish", () => {
      const updatedState = raceControlService.finishRace()
      io.emit("race-control:state", updatedState)
    })

    socket.on("race-control:end-session", () => {
      const updatedState = raceControlService.endSession()
      io.emit("race-control:state", updatedState)
    })
  })
}