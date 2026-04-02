# Public screens (apps/web)

This app contains the **4 public displays** (read-only):

- `/leader-board`
- `/next-race`
- `/race-countdown`
- `/race-flags`

It connects to the backend via **Socket.IO** and listens to a single event: `race-control:state`.

## Tech

- Vite + React + TypeScript
- React Router
- Tailwind (via `@tailwindcss/vite`)
- `socket.io-client`

## Run (dev)

Terminal 1 (backend):

```bash
# from repo root
npm install
npm start
```

Terminal 2 (public screens):

```bash
cd apps/web
npm install
npm run dev
```

Open:

- http://localhost:5174/leader-board
- http://localhost:5174/next-race
- http://localhost:5174/race-countdown
- http://localhost:5174/race-flags

## How the socket is used

The core subscription is implemented in `src/hooks/useRaceState.ts`:

- connect once on mount
- `socket.on('race-control:state', ...)` updates React state
- cleanup on unmount (`off` + `disconnect`)
