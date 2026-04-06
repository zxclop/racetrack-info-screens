import { CurrentRaceResponseDto } from "./race-control.schemas"
import { CurrentRace } from "./race-control.types"

const formatLapTime = (timeMs: number) => {
  const minutes = Math.floor(timeMs / 60000)
  const seconds = Math.floor((timeMs % 60000) / 1000)
  const milliseconds = timeMs % 1000

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}`
}

export const raceControlMapper = {
  toResponse(currentRace: CurrentRace): CurrentRaceResponseDto {
    return {
      sessionId: currentRace.sessionId,
      sessionName: currentRace.sessionName,
      mode: currentRace.mode,
      startedAt: currentRace.startedAt,
      endedAt: currentRace.endedAt,
      participants: currentRace.participants.map((participant) => ({
        name: participant.driverName,
        laps: participant.laps,
      })),
      bestLap: currentRace.bestLap
        ? {
            time: formatLapTime(currentRace.bestLap.timeMs),
            racerName: currentRace.bestLap.racerName,
          }
        : null,
    }
  },
}