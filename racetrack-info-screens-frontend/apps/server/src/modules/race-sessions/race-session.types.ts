export interface RaceSession {
    id: string;
    name: string;
    racerNames: string[];
    startTime: string;
    endTime: string;
    bestLap?: { time: string; racerName: string };
}
