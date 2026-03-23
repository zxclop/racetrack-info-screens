import crypto from "crypto"
import { RaceSession } from "../modules/race-sessions/race-session.types"

export const store = {
  currentRace: {
    sessionId: null,
    status: "idle",
    timer: null,
    participants: [],
    leaderboard: [],
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
    const existingSession = this.sessions.get(id)

    if (!existingSession) {
      return null
    }

    const updatedSession: RaceSession = {
      ...existingSession,
      ...updatedFields,
      id: existingSession.id,
    }

    this.sessions.set(id, updatedSession)
    return updatedSession
  }

  delete(id: string) {
    return this.sessions.delete(id)
  }
}

export const raceStore = new RaceSessionStore()