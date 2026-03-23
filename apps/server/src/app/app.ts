import Fastify from "fastify"
import { registerAppPlugins } from "./plugins"
import { registerAppRoutes } from "./routes"

export const app = Fastify({
  logger: true,
})

 registerAppPlugins(app)
 registerAppRoutes(app)