import type { FastifyPluginAsync } from "fastify"
import {
  validateAccessKeyResponseSchema,
  validateAccessKeySchema,
  ValidateAccessKeyBodyDto,
  ValidateAccessKeyReplyDto,
} from "./auth.schemas"
import { authService } from "./auth.service"

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: ValidateAccessKeyBodyDto; Reply: ValidateAccessKeyReplyDto }>(
    "/validate",
    {
      schema: {
        body: validateAccessKeySchema,
        response: {
          200: validateAccessKeyResponseSchema,
        },
      },
      handler: async (request) => {
        return authService.validateAccessKey(request.body)
      },
    }
  )
}

export default authRoutes
