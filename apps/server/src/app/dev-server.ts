process.env.RACE_DURATION_SECONDS = process.env.RACE_DURATION_SECONDS ?? "60"

import { startServer } from "./start"

startServer()
