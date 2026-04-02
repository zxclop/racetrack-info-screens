import { CurrentRaceResponseDto } from "./race-control.schemas"
import { CurrentRace } from "./race-control.types"

export const raceControlMapper = {
  toResponse(currentRace: CurrentRace): CurrentRaceResponseDto {
    return {
      sessionId: currentRace.sessionId,
      sessionName: currentRace.sessionName,
      mode: currentRace.mode,
      startedAt: currentRace.startedAt,
      endedAt: currentRace.endedAt,
      participants: currentRace.participants,
      bestLap: currentRace.bestLap,
    }
  },
}