import type { FastifyPluginAsync } from "fastify"
import { requireRoles } from "../auth/auth.guards"
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
    preHandler: requireRoles(["receptionist", "safety", "observer"]),
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
    preHandler: requireRoles(["safety"]),
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
    preHandler: requireRoles(["safety"]),
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
    preHandler: requireRoles(["safety"]),
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
    preHandler: requireRoles(["safety"]),
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