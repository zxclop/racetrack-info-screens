import type { FastifyPluginAsync } from "fastify"
import { raceSessionsService } from "./race-sessions.service"
import {
  createRaceSessionSchema,
  idParamsSchema,
  CreateRaceSessionDto,
  IdParamsDto,
  raceSessionSchema,
  RaceSessionDto,
  updateRaceSessionSchema,
  UpdateRaceSessionDto,
} from "./race-session.schemas"

const raceSessionsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: raceSessionSchema
            }, message: { type: "string" }
          }, required: ["items", "message"]
        }
      }
    },
    handler: async () => {
      return raceSessionsService.getAll()
    }
  })

  app.post<{ Body: CreateRaceSessionDto, Reply: RaceSessionDto }>("/", {
    schema: {
      body: createRaceSessionSchema,
      response: {
        201: raceSessionSchema,
      },
    },
    handler: async (request, reply) => {
      const result = raceSessionsService.create(request.body)
      return reply.code(201).send(result)
    },
  })

  app.patch<{
    Params: IdParamsDto
    Body: UpdateRaceSessionDto
    Reply: RaceSessionDto
  }>("/:id", {
    schema: {
      params: idParamsSchema,
      body: updateRaceSessionSchema,
      response: {
        200: raceSessionSchema,
      },
    },
    handler: async (request) => {
      const { id } = request.params
      return raceSessionsService.update(id, request.body)
    },
  })
  
  app.delete<{ Params: IdParamsDto }>("/:id", {
    schema: {
      params: idParamsSchema,
      response: {
        204: { type: "null" }
      }
  }, 
  handler: async (request, reply) => {
    const { id } = request.params
    raceSessionsService.remove(id)
    return reply.code(204).send()
  }
  })
}

export default raceSessionsRoutes
