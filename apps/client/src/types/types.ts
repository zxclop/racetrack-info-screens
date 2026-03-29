export interface RaceSession {
  id: string;
  name: string;
  racerNames: string[];
  startTime: string;
  endTime: string;
  bestLap?: number;
}

export type RaceStatus =
  | 'idle'
  | 'countdown'
  | 'safe'
  | 'hazard'
  | 'danger'
  | 'finish'
  | 'ended';

export type NewSessionData = Omit<RaceSession, 'id' | 'bestLap'>;

export interface Participant {
  carNumber: number;
  driverName: string;
  laps: number;
  bestLapTime: number | null;
}

export interface LeaderboardEntry {
  carNumber: number;
  driverName: string;
  laps: number;
  bestLapTime: number | null;
}

export interface RaceState {
  sessionId: string | null;
  status: RaceStatus;
  timer: number | null;
  participants: Participant[];
  leaderboard: LeaderboardEntry[];
}

export type Role = 'receptionist' | 'safety' | 'observer';
