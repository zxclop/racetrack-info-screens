import {
  CreateRaceSessionDto,
} from "./race-session.schemas"

export const validateCreateRaceSession = (data: any): CreateRaceSessionDto => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid input: expected an object")
  }
  return data as CreateRaceSessionDto
}

export const raceSessionValidators = {
  
}