export type RaceMode =
  | "idle"
  | "safe"
  | "hazard"
  | "danger"
  | "finish"
  | "ended"

export interface CurrentRaceParticipant {
  name: string
  laps: number
}

export interface CurrentRaceBestLap {
  time: string
  racerName: string
}

export interface CurrentRace {
  sessionId: string | null
  sessionName: string | null
  mode: RaceMode
  startedAt: string | null
  endedAt: string | null
  participants: CurrentRaceParticipant[]
  bestLap: CurrentRaceBestLap | null
}

export interface StartRaceCommand {
  sessionId: string
}

export interface SetRaceModeCommand {
  mode: Exclude<RaceMode, "idle" | "ended">
}