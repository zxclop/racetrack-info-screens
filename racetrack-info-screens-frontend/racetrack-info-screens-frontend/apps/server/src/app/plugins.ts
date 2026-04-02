import type { FastifyInstance } from "fastify"
import cors from "@fastify/cors"

const FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
]

export const registerAppPlugins = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: FRONTEND_ORIGINS,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
}