import { createEmptyRace, raceStore, store } from "../../state/in-memory-store"
import { raceControlMapper } from "./race-control.mapper"
import {
  EndSessionDto,
  RecordLapDto,
  SetRaceModeDto,
  StartRaceDto,
} from "./race-control.schemas"
import {
  ActiveRaceNotFoundError,
  ParticipantNotFoundError,
  RaceAlreadyStartedError,
  SessionNotFoundError,
} from "./race-control.errors"
import { raceStateMachine } from "./race-state-machine"
import type { CurrentRace, CurrentRaceParticipant } from "./race-control.types"

const DEFAULT_RACE_DURATION_SECONDS = 10 * 60
let timerHandle: NodeJS.Timeout | null = null
const raceSubscribers = new Set<() => void>()

const cloneParticipant = (
  participant: CurrentRaceParticipant
): CurrentRaceParticipant => ({
  ...participant,
})

const cloneRaceState = (race: CurrentRace): CurrentRace => ({
  ...race,
  participants: race.participants.map(cloneParticipant),
  bestLap: race.bestLap ? { ...race.bestLap } : null,
})

const notifyRaceSubscribers = () => {
  for (const subscriber of raceSubscribers) {
    subscriber()
  }
}

const stopTimer = () => {
  if (timerHandle) {
    clearInterval(timerHandle)
    timerHandle = null
  }
}

const resolveRaceDurationSeconds = () => {
  const configuredDuration = Number.parseInt(
    process.env.RACE_DURATION_SECONDS ?? "",
    10
  )

  if (Number.isFinite(configuredDuration) && configuredDuration > 0) {
    return configuredDuration
  }

  return DEFAULT_RACE_DURATION_SECONDS
}

const calculateRemainingSeconds = (race: CurrentRace) => {
  if (!race.startedAt || !race.durationSeconds) {
    return null
  }

  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(race.startedAt).getTime()) / 1000
  )

  return Math.max(0, race.durationSeconds - elapsedSeconds)
}

const startTimer = () => {
  stopTimer()

  timerHandle = setInterval(() => {
    const race = store.currentRace

    if (
      !race.sessionId ||
      !race.durationSeconds ||
      race.mode === "idle" ||
      race.mode === "finish" ||
      race.mode === "ended"
    ) {
      stopTimer()
      return
    }

    const remainingSeconds = calculateRemainingSeconds(race)

    if (remainingSeconds === null) {
      stopTimer()
      return
    }

    if (race.remainingSeconds !== remainingSeconds) {
      race.remainingSeconds = remainingSeconds
      notifyRaceSubscribers()
    }

    if (remainingSeconds === 0) {
      race.mode = "finish"
      stopTimer()
      notifyRaceSubscribers()
    }
  }, 1000)
}

export const raceControlService = {
  getCurrentState() {
    return raceControlMapper.toResponse(store.currentRace)
  },

  getCurrentRace() {
    return store.currentRace
  },

  getLastCompletedRace() {
    return store.lastCompletedRace
  },

  startRace(data: StartRaceDto) {
    const session = raceStore.findById(data.sessionId)

    if (!session) {
      throw new SessionNotFoundError(data.sessionId)
    }

    if (
      store.currentRace.sessionId &&
      store.currentRace.mode !== "idle" &&
      store.currentRace.mode !== "ended"
    ) {
      throw new RaceAlreadyStartedError()
    }

    const durationSeconds = resolveRaceDurationSeconds()

    raceStore.delete(session.id)
    store.lastCompletedRace = null
    store.currentRace = {
      sessionId: session.id,
      sessionName: session.name,
      mode: "safe",
      startedAt: new Date().toISOString(),
      endedAt: null,
      durationSeconds,
      remainingSeconds: durationSeconds,
      participants: session.racerNames.map((name, index) => ({
        carNumber: index + 1,
        driverName: name,
        laps: 0,
        lastCrossedAt: null,
        lastLapTimeMs: null,
        bestLapTimeMs: null,
      })),
      bestLap: null,
    }

    startTimer()
    notifyRaceSubscribers()

    return raceControlMapper.toResponse(store.currentRace)
  },

  setRaceMode(data: SetRaceModeDto) {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    if (data.mode === "finish") {
      return this.finishRace()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, data.mode)
    store.currentRace.mode = data.mode
    notifyRaceSubscribers()

    return raceControlMapper.toResponse(store.currentRace)
  },

  recordLap(data: RecordLapDto) {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    if (store.currentRace.mode === "idle" || store.currentRace.mode === "ended") {
      throw new ActiveRaceNotFoundError()
    }

    const participant = store.currentRace.participants.find(
      (item) => item.driverName === data.racerName
    )

    if (!participant) {
      throw new ParticipantNotFoundError(data.racerName)
    }

    const crossedAt = new Date()
    const crossedAtIso = crossedAt.toISOString()

    if (!participant.lastCrossedAt) {
      participant.laps = 1
      participant.lastCrossedAt = crossedAtIso
      notifyRaceSubscribers()
      return raceControlMapper.toResponse(store.currentRace)
    }

    const lapTimeMs =
      crossedAt.getTime() - new Date(participant.lastCrossedAt).getTime()

    participant.laps += 1
    participant.lastCrossedAt = crossedAtIso
    participant.lastLapTimeMs = lapTimeMs

    if (
      participant.bestLapTimeMs === null ||
      lapTimeMs < participant.bestLapTimeMs
    ) {
      participant.bestLapTimeMs = lapTimeMs
    }

    if (
      !store.currentRace.bestLap ||
      lapTimeMs < store.currentRace.bestLap.timeMs
    ) {
      store.currentRace.bestLap = {
        timeMs: lapTimeMs,
        racerName: participant.driverName,
        carNumber: participant.carNumber,
      }
    }

    notifyRaceSubscribers()

    return raceControlMapper.toResponse(store.currentRace)
  },

  finishRace() {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, "finish")
    store.currentRace.mode = "finish"
    store.currentRace.remainingSeconds =
      calculateRemainingSeconds(store.currentRace) ??
      store.currentRace.remainingSeconds
    stopTimer()
    notifyRaceSubscribers()

    return raceControlMapper.toResponse(store.currentRace)
  },

  endSession(_data?: EndSessionDto) {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, "ended")
    store.currentRace.mode = "ended"
    store.currentRace.endedAt = new Date().toISOString()
    stopTimer()
    store.lastCompletedRace = cloneRaceState(store.currentRace)
    notifyRaceSubscribers()

    return raceControlMapper.toResponse(store.currentRace)
  },

  reset() {
    stopTimer()
    store.currentRace = createEmptyRace()
    store.lastCompletedRace = null
    notifyRaceSubscribers()
  },

  subscribe(listener: () => void) {
    raceSubscribers.add(listener)

    return () => {
      raceSubscribers.delete(listener)
    }
  }
}
