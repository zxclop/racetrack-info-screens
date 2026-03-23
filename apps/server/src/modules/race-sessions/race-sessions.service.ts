import {
  CreateRaceSessionDto,
  UpdateRaceSessionDto,
} from "./race-session.schemas"
import { raceStore } from "../../state/in-memory-store";
import { raceSessionValidators } from "./race-session.validators";

export const raceSessionsService = {
  getAll() {
    return {
      items: raceStore.findAll(),
      message: "sessions retrieved successfully",
    };
  },

  create(raceSession: CreateRaceSessionDto) {
    const createdSession = raceStore.create(raceSession);

    return createdSession;
  },

  update(id: string, updatedFields: UpdateRaceSessionDto) {
    const updatedSession = raceStore.update(id, updatedFields);

    if (!updatedSession) {
      throw new Error("session not found");
    }

    return updatedSession;
  },

  remove(id: string) {
    const deleted = raceStore.delete(id);

    if (!deleted) {
      throw new Error("session not found");
    }
  },
};