export type RaceMode =
  | "idle"
  | "safe"
  | "hazard"
  | "danger"
  | "finish"
  | "ended"

export interface CurrentRaceParticipant {
  carNumber: number
  driverName: string
  laps: number
  lastCrossedAt: string | null
  lastLapTimeMs: number | null
  bestLapTimeMs: number | null
}

export interface CurrentRaceBestLap {
  timeMs: number
  racerName: string
  carNumber: number
}

export interface CurrentRace {
  sessionId: string | null
  sessionName: string | null
  mode: RaceMode
  startedAt: string | null
  endedAt: string | null
  durationSeconds: number | null
  remainingSeconds: number | null
  participants: CurrentRaceParticipant[]
  bestLap: CurrentRaceBestLap | null
}

export type CompletedRace = CurrentRace
export interface StartRaceCommand {
  sessionId: string
}

export interface SetRaceModeCommand {
  mode: Exclude<RaceMode, "idle" | "ended">
}

export interface RecordLapCommand {
  racerName: string
}