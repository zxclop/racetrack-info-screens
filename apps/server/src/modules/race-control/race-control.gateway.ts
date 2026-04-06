import type { Server, Socket } from "socket.io"
import { raceStore } from "../../state/in-memory-store"
import { raceSessionsService } from "../race-sessions/race-sessions.service"
import { requireSocketRoles } from "../auth/auth.guards"
import { SessionNotFoundError } from "./race-control.errors"
import { raceControlService } from "./race-control.service"

type RealtimeParticipant = {
  carNumber: number
  driverName: string
  laps: number
  bestLapTime: number | null
}

type RealtimeSessionPreview = {
  sessionId: string
  sessionName: string
  participants: Array<Pick<RealtimeParticipant, "carNumber" | "driverName">>
}

type RealtimeRaceState = {
  sessionId: string | null
  status: "idle" | "safe" | "hazard" | "danger" | "finish" | "ended"
  timer: number | null
  flagStatus: "safe" | "hazard" | "danger" | "finish"
  participants: RealtimeParticipant[]
  leaderboard: RealtimeParticipant[]
  nextRace: RealtimeSessionPreview | null
  lastRace: {
    sessionId: string
    sessionName: string
    leaderboard: RealtimeParticipant[]
    endedAt: string | null
  } | null
  callToPaddock: boolean
}

const buildParticipant = (
  driverName: string,
  carNumber: number,
  laps: number,
  bestLapTime: number | null
): RealtimeParticipant => ({
  carNumber,
  driverName,
  laps,
  bestLapTime,
})

const buildSessionPreview = (
  session: ReturnType<typeof raceStore.peekNext>
): RealtimeSessionPreview | null => {
  if (!session) {
    return null
  }

  return {
    sessionId: session.id,
    sessionName: session.name,
    participants: session.racerNames.map((driverName, index) => ({
      carNumber: index + 1,
      driverName,
    })),
  }
}

const sortLeaderboard = (participants: RealtimeParticipant[]) =>
  [...participants].sort((left, right) => {
    if (left.bestLapTime === null && right.bestLapTime === null) {
      return left.carNumber - right.carNumber
    }

    if (left.bestLapTime === null) {
      return 1
    }

    if (right.bestLapTime === null) {
      return -1
    }

    return (
      left.bestLapTime - right.bestLapTime ||
      right.laps - left.laps ||
      left.carNumber - right.carNumber
    )
  })

const buildLastRacePreview = () => {
  const lastRace = raceControlService.getLastCompletedRace()

  if (!lastRace?.sessionId) {
    return null
  }

  return {
    sessionId: lastRace.sessionId,
    sessionName: lastRace.sessionName ?? "Last race",
    leaderboard: sortLeaderboard(
      lastRace.participants.map((participant) =>
        buildParticipant(
          participant.driverName,
          participant.carNumber,
          participant.laps,
          participant.bestLapTimeMs
        )
      )
    ),
    endedAt: lastRace.endedAt,
  }
}

const buildRealtimeRaceState = (): RealtimeRaceState => {
  const currentRace = raceControlService.getCurrentRace()
  const nextRace = buildSessionPreview(raceStore.peekNext())
  const lastRace = buildLastRacePreview()

  if (currentRace.mode === "idle" && !currentRace.sessionId) {
    const participants = nextRace
      ? nextRace.participants.map((participant) =>
          buildParticipant(participant.driverName, participant.carNumber, 0, null)
        )
      : []

    return {
      sessionId: nextRace?.sessionId ?? null,
      status: "idle",
      timer: null,
      flagStatus: "danger",
      participants,
      leaderboard: sortLeaderboard(participants),
      nextRace,
      lastRace,
      callToPaddock: false,
    }
  }

  const participants = currentRace.participants.map((participant) =>
    buildParticipant(
      participant.driverName,
      participant.carNumber,
      participant.laps,
      participant.bestLapTimeMs
    )
  )

  const leaderboard = sortLeaderboard(participants)

  return {
    sessionId: currentRace.sessionId,
    status: currentRace.mode,
    timer: currentRace.remainingSeconds,
    flagStatus:
      currentRace.mode === "idle" || currentRace.mode === "ended"
        ? "danger"
        : currentRace.mode,
    participants,
    leaderboard,
    nextRace,
    lastRace,
    callToPaddock: currentRace.mode === "ended" && nextRace !== null,
  }
}

const emitState = (io: Server) => {
  const state = buildRealtimeRaceState()
  io.emit("race:state", state)
  io.emit("race:updated", state)
}

const emitError = (socket: Socket, error: unknown) => {
  socket.emit("race:error", {
    message: error instanceof Error ? error.message : "Unexpected server error",
  })
}

const runAuthorizedAction = (
  io: Server,
  socket: Socket,
  allowedRoles: readonly ("safety" | "observer")[],
  action: () => void
) => {
  try {
    requireSocketRoles(socket, allowedRoles)
    action()
  } catch (error) {
    emitError(socket, error)
  }
}

const resolveSessionId = (payload: unknown) => {
  if (
    typeof payload === "object" &&
    payload &&
    "sessionId" in payload &&
    typeof payload.sessionId === "string" &&
    payload.sessionId.trim()
  ) {
    return payload.sessionId.trim()
  }

  return raceStore.findAll()[0]?.id ?? null
}

const resolveRacerName = (payload: unknown) => {
  if (
    typeof payload === "object" &&
    payload &&
    "racerName" in payload &&
    typeof payload.racerName === "string" &&
    payload.racerName.trim()
  ) {
    return payload.racerName.trim()
  }

  if (
    typeof payload === "object" &&
    payload &&
    "carNumber" in payload &&
    typeof payload.carNumber === "number"
  ) {
    return (
      raceControlService
        .getCurrentRace()
        .participants.find(
          (participant) => participant.carNumber === payload.carNumber
        )?.driverName ?? null
    )
  }

  return null
}

export const registerRaceControlGateway = (io: Server) => {
  raceControlService.subscribe(() => {
    emitState(io)
  })

  raceSessionsService.subscribe(() => {
    emitState(io)
  })

  io.on("connection", (socket) => {
    socket.emit("race:state", buildRealtimeRaceState())

    socket.on("race:start", (payload) => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        const sessionId = resolveSessionId(payload)

        if (!sessionId) {
          throw new SessionNotFoundError("next")
        }

        raceControlService.startRace({ sessionId })
      })
    })

    socket.on("race-control:start", (payload) => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        const sessionId = resolveSessionId(payload)

        if (!sessionId) {
          throw new SessionNotFoundError("next")
        }

        raceControlService.startRace({ sessionId })
      })
    })

    socket.on("race:mode-change", (payload) => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        if (
          typeof payload !== "object" ||
          !payload ||
          !("mode" in payload) ||
          typeof payload.mode !== "string"
        ) {
          throw new Error("Mode is required")
        }

        raceControlService.setRaceMode({ mode: payload.mode as "safe" | "hazard" | "danger" | "finish" })
      })
    })

    socket.on("race-control:set-mode", (payload) => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        if (
          typeof payload !== "object" ||
          !payload ||
          !("mode" in payload) ||
          typeof payload.mode !== "string"
        ) {
          throw new Error("Mode is required")
        }

        raceControlService.setRaceMode({ mode: payload.mode as "safe" | "hazard" | "danger" | "finish" })
      })
    })

    socket.on("lap:record", (payload) => {
      runAuthorizedAction(io, socket, ["observer"], () => {
        const racerName = resolveRacerName(payload)

        if (!racerName) {
          throw new Error("Unable to resolve racer for lap event")
        }

        raceControlService.recordLap({ racerName })
      })
    })

    socket.on("race-control:finish", () => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        raceControlService.finishRace()
      })
    })

    socket.on("race:end-session", () => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        raceControlService.endSession()
      })
    })

    socket.on("race-control:end-session", () => {
      runAuthorizedAction(io, socket, ["safety"], () => {
        raceControlService.endSession()
      })
    })
  })
}