import { InvalidRaceTransitionError } from "./race-control.errors"
import { RaceMode } from "./race-control.types"

const allowedTransitions: Record<RaceMode, RaceMode[]> = {
  idle: ["safe"],
  safe: ["hazard", "danger", "finish"],
  hazard: ["safe", "danger", "finish"],
  danger: ["safe", "hazard", "finish"],
  finish: ["ended"],
  ended: [],
}

export const raceStateMachine = {
  canTransition(from: RaceMode, to: RaceMode) {
    return allowedTransitions[from].includes(to)
  },

  assertTransition(from: RaceMode, to: RaceMode) {
    if (!this.canTransition(from, to)) {
      throw new InvalidRaceTransitionError(from, to)
    }
  },
}