import { store } from "../../state/in-memory-store"

export const raceControlService = {
  getState() {
    return store.currentRace
  },

  startRace() {
    return {
      success: true,
      message: "",
    }
  },

  finishRace() {
    return {
      success: true,
      message: "",
    }
  },

  endSession() {
    return {
      success: true,
      message: "",
    }
  },
}