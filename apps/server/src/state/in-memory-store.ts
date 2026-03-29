import crypto from "crypto"
import { RaceSession } from "../modules/race-sessions/race-session.types"
import { CurrentRace } from "../modules/race-control/race-control.types"

export const store: { currentRace: CurrentRace; nextSessions: RaceSession[]; finishedSessions: RaceSession[] } = {
  currentRace: {
    sessionId: null,
    sessionName: null,
    mode: "idle",
    startedAt: null,
    endedAt: null,
    participants: [],
    bestLap: null,
  },

  nextSessions: [],

  finishedSessions: [],
}

class RaceSessionStore {
  private sessions = new Map<string, RaceSession>()

  findAll() {
    return Array.from(this.sessions.values())
  }

  findById(id: string) {
    return this.sessions.get(id)
  }

  create(data: Omit<RaceSession, "id">) {
    const id = crypto.randomUUID()
    const newSession: RaceSession = { id, ...data }
    this.sessions.set(id, newSession)
    return newSession
  }

  update(id: string, updatedFields: Partial<Omit<RaceSession, "id">>) {
    const existing = this.sessions.get(id)

    if (!existing) return null

    const updated: RaceSession = {
      ...existing,
      ...updatedFields,
      id: existing.id,
    }

    this.sessions.set(id, updated)
    return updated
  }

  delete(id: string) {
    return this.sessions.delete(id)
  }
}

export const raceStore = new RaceSessionStore()