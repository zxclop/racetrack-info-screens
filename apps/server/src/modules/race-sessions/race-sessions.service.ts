import {
  CreateRaceSessionDto,
  UpdateRaceSessionDto,
} from "./race-session.schemas"
import { raceStore } from "../../state/in-memory-store"
import { raceSessionValidators } from "./race-session.validators"

const sessionSubscribers = new Set<() => void>()

const notifySessionSubscribers = () => {
  for (const subscriber of sessionSubscribers) {
    subscriber()
  }
}

export const raceSessionsService = {
  getAll() {
    return {
      items: raceStore.findAll(),
      message: "sessions retrieved successfully",
    }
  },

  create(raceSession: CreateRaceSessionDto) {
    const createdSession = raceStore.create(
      raceSessionValidators.prepareCreate(raceSession)
    )

    notifySessionSubscribers()

    return createdSession
  },

  update(id: string, updatedFields: UpdateRaceSessionDto) {
    const updatedSession = raceStore.update(
      id,
      raceSessionValidators.prepareUpdate(updatedFields)
    )

    if (!updatedSession) {
      throw new Error("session not found")
    }

    notifySessionSubscribers()

    return updatedSession
  },

  remove(id: string) {
    const deleted = raceStore.delete(id)

    if (!deleted) {
      throw new Error("session not found")
    }

    notifySessionSubscribers()
  },

  subscribe(listener: () => void) {
    sessionSubscribers.add(listener)

    return () => {
      sessionSubscribers.delete(listener)
    }
  }
}
