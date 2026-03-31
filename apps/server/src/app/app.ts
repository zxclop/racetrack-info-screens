import Fastify from "fastify"
import { registerAppPlugins } from "./plugins"
import { registerAppRoutes } from "./routes"

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  })

  await registerAppPlugins(app)
  await registerAppRoutes(app)

  return app
}
