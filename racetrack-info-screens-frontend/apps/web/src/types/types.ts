export interface BestLap {
  time: string;
  racerName: string;
}

export type RaceMode =
  | 'idle'
  | 'safe'
  | 'hazard'
  | 'danger'
  | 'finish'
  | 'ended';

export interface Participant {
  name: string;
  laps: number;
}

export interface RaceState {
  sessionId: string | null;
  sessionName: string | null;
  mode: RaceMode;
  startedAt: string | null;
  endedAt: string | null;
  participants: Participant[];
  bestLap: BestLap | null;
}

export interface RaceSession {
  id: string;
  name: string;
  racerNames: string[];
  startTime: string;
  endTime: string;
  bestLap?: BestLap;
}
