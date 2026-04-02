import { raceStore, store } from "../../state/in-memory-store"
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

export const raceControlService = {
  getCurrentState() {
    return raceControlMapper.toResponse(store.currentRace)
  },

  startRace(data: StartRaceDto) {
    const session = raceStore.findById(data.sessionId)

    if (!session) {
      throw new SessionNotFoundError(data.sessionId)
    }

    if (store.currentRace.sessionId && store.currentRace.mode !== "ended") {
      throw new RaceAlreadyStartedError()
    }

    store.currentRace = {
      sessionId: session.id,
      sessionName: session.name,
      mode: "safe",
      startedAt: new Date().toISOString(),
      endedAt: null,
      participants: session.racerNames.map((name) => ({
        name,
        laps: 0,
      })),
      bestLap: session.bestLap ?? null,
    }

    return raceControlMapper.toResponse(store.currentRace)
  },

  setRaceMode(data: SetRaceModeDto) {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, data.mode)

    store.currentRace.mode = data.mode

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
      (item) => item.name === data.racerName
    )

    if (!participant) {
      throw new ParticipantNotFoundError(data.racerName)
    }

    participant.laps += 1

    return raceControlMapper.toResponse(store.currentRace)
  },

  finishRace() {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, "finish")

    store.currentRace.mode = "finish"

    return raceControlMapper.toResponse(store.currentRace)
  },

  endSession(_data?: EndSessionDto) {
    if (!store.currentRace.sessionId) {
      throw new ActiveRaceNotFoundError()
    }

    raceStateMachine.assertTransition(store.currentRace.mode, "ended")

    store.currentRace.mode = "ended"
    store.currentRace.endedAt = new Date().toISOString()

    return raceControlMapper.toResponse(store.currentRace)
  },
}