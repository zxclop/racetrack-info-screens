import { assertAccessKeysConfigured } from "../modules/auth/auth.constants"
import { buildApp } from "./app"
import { buildSocket } from "./socket"

export const startServer = async () => {
  try {
    assertAccessKeysConfigured()

    const app = await buildApp()

    await app.ready()
    buildSocket(app.server)

    await app.listen({
      port: 3001,
      host: "0.0.0.0",
    })

    app.log.info("Backend started")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
