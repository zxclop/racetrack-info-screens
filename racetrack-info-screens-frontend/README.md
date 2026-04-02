# racetrack-info-screens

Monorepo with:

- `apps/server` — Fastify + Socket.IO backend (runs on `http://localhost:3001`)
- `apps/client` — employee UI (Vite dev server, default `http://localhost:5173`)
- `apps/web` — public screens (Vite dev server `http://localhost:5174`)

## Quick start (dev)

Backend:

```bash
npm install
npm start
```

Employee UI:

```bash
cd apps/client
npm install
npm run dev
```

Public screens:

```bash
cd apps/web
npm install
npm run dev
```