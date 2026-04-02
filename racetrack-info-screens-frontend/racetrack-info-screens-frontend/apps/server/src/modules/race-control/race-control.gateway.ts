import type { Server } from "socket.io"
import { raceControlService } from "./race-control.service"

export const registerRaceControlGateway = (io: Server) => {
  const emitState = () => {
    io.emit("race-control:state", raceControlService.getCurrentState())
  }

  io.on("connection", (socket) => {
    socket.emit("race-control:state", raceControlService.getCurrentState())

    socket.on("race-control:start", (payload) => {
      raceControlService.startRace(payload)
      emitState()
    })

    socket.on("race-control:set-mode", (payload) => {
      raceControlService.setRaceMode(payload)
      emitState()
    })

    socket.on("lap:record", (payload) => {
      raceControlService.recordLap(payload)
      emitState()
    })

    socket.on("race-control:finish", () => {
      raceControlService.finishRace()
      emitState()
    })

    socket.on("race-control:end-session", () => {
      raceControlService.endSession()
      emitState()
    })
  })
}