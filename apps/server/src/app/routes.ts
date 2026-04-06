import type { FastifyInstance } from "fastify"

// import systemRoutes from "../modules/system/system.routes"
import authRoutes from "../modules/auth/auth.routes"
import raceSessionsRoutes from "../modules/race-sessions/race-sessions.routes"
import raceControlRoutes from "../modules/race-control/race-control.routes"

export const registerAppRoutes = async (app: FastifyInstance) => {
  // await app.register(systemRoutes)
  await app.register(authRoutes, { prefix: "/auth" })
  await app.register(raceSessionsRoutes, { prefix: "/race-sessions" })
  await app.register(raceControlRoutes, { prefix: "/race-control" })
}