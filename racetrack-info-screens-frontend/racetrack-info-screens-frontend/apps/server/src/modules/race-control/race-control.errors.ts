export class RaceControlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RaceControlError"
  }
}

export class ActiveRaceNotFoundError extends RaceControlError {
  constructor() {
    super("Active race not found")
    this.name = "ActiveRaceNotFoundError"
  }
}

export class InvalidRaceTransitionError extends RaceControlError {
  constructor(from: string, to: string) {
    super(`Invalid race transition from "${from}" to "${to}"`)
    this.name = "InvalidRaceTransitionError"
  }
}

export class SessionNotFoundError extends RaceControlError {
  constructor(sessionId: string) {
    super(`Session with id "${sessionId}" not found`)
    this.name = "SessionNotFoundError"
  }
}

export class RaceAlreadyStartedError extends RaceControlError {
  constructor() {
    super("Race has already started")
    this.name = "RaceAlreadyStartedError"
  }
}

export class ParticipantNotFoundError extends RaceControlError {
  constructor(racerName: string) {
    super(`Participant "${racerName}" not found in active race`)
    this.name = "ParticipantNotFoundError"
  }
}