import type { FastifyPluginAsync } from "fastify"
import { raceControlService } from "./race-control.service"
import {
  currentRaceResponseSchema,
  endSessionSchema,
  EndSessionDto,
  finishRaceSchema,
  FinishRaceDto,
  setRaceModeSchema,
  SetRaceModeDto,
  startRaceSchema,
  StartRaceDto,
} from "./race-control.schemas"

const raceControlRoutes: FastifyPluginAsync = async (app) => {
  app.get("/state", {
    schema: {
      response: {
        200: currentRaceResponseSchema,
      },
    },
    handler: async () => {
      return raceControlService.getCurrentState()
    },
  })

  app.post<{ Body: StartRaceDto }>("/start", {
    schema: {
      body: startRaceSchema,
      response: {
        200: currentRaceResponseSchema,
      },
    },
    handler: async (request) => {
      return raceControlService.startRace(request.body)
    },
  })

  app.post<{ Body: SetRaceModeDto }>("/mode", {
    schema: {
      body: setRaceModeSchema,
      response: {
        200: currentRaceResponseSchema,
      },
    },
    handler: async (request) => {
      return raceControlService.setRaceMode(request.body)
    },
  })

  app.post<{ Body: FinishRaceDto }>("/finish", {
    schema: {
      body: finishRaceSchema,
      response: {
        200: currentRaceResponseSchema,
      },
    },
    handler: async () => {
      return raceControlService.finishRace()
    },
  })

  app.post<{ Body: EndSessionDto }>("/end-session", {
    schema: {
      body: endSessionSchema,
      response: {
        200: currentRaceResponseSchema,
      },
    },
    handler: async (request) => {
      return raceControlService.endSession(request.body as '' | undefined)
    },
  })
}

export default raceControlRoutes