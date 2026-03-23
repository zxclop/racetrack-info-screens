// import type { Server } from "socket.io"
// import { raceControlService } from "./race-control.service"

// export const registerRaceGateway = (io: Server) => {
//   io.on("connection", (socket) => {
//     socket.emit("race:state", raceControlService.getState())

//     socket.on("race:start", () => {
//       const result = raceControlService.startRace()
//       io.emit("race:updated", result)
//     })

//     socket.on("race:finish", () => {
//       const result = raceControlService.finishRace()
//       io.emit("race:updated", result)
//     })

//     socket.on("race:end-session", () => {
//       const result = raceControlService.endSession()
//       io.emit("race:updated", result)
//     })

//     socket.on("disconnect", () => {
      
//     })
//   })
// }