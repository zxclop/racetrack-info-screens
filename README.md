# Racetrack Info Screens

A real-time racetrack management system for Beachside Racetrack. Controls races, informs spectators, and manages race sessions — all in real time via Socket.IO.

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
npm install
cd apps/client && npm install && cd ../..
cd apps/web && npm install && cd ../..
```

### Environment Variables (Required)

Set these before starting the server:

**PowerShell:**
```powershell
$env:RECEPTIONIST_ACCESS_KEY="frontdesk"
$env:SAFETY_ACCESS_KEY="safety"
$env:OBSERVER_ACCESS_KEY="observer"
```

**Bash/Linux/Mac:**
```bash
export RECEPTIONIST_ACCESS_KEY=frontdesk
export SAFETY_ACCESS_KEY=safety
export OBSERVER_ACCESS_KEY=observer
```

The server **will not start** unless all three access keys are defined.

### Start (Production — 10 min races)

```bash
npm start
```

### Start (Dev Mode — 1 min races)

```bash
npm run dev
```

Both commands start the backend server (port 3001), the employee interface (port 5173), and the public displays (port 5174) concurrently.

## Interfaces & Routes

### Employee Interfaces (require access key)

| Interface | Persona | URL | Access Key |
|-----------|---------|-----|------------|
| Front Desk | Receptionist | http://localhost:5173/front-desk | `RECEPTIONIST_ACCESS_KEY` |
| Race Control | Safety Official | http://localhost:5173/race-control | `SAFETY_ACCESS_KEY` |
| Lap-line Tracker | Lap-line Observer | http://localhost:5173/lap-line-tracker | `OBSERVER_ACCESS_KEY` |

### Public Displays (no access key needed)

| Interface | Persona | URL |
|-----------|---------|-----|
| Leader Board | Spectators | http://localhost:5174/leader-board |
| Next Race | Race Drivers | http://localhost:5174/next-race |
| Race Countdown | Race Drivers | http://localhost:5174/race-countdown |
| Race Flags | Race Drivers | http://localhost:5174/race-flags |

All public displays feature a **fullscreen button** for use on large monitors.

### Network Access

All interfaces are accessible from other devices on the same network. Replace `localhost` with your machine's IP address (shown in terminal output on startup, e.g., `192.168.0.100`).

## User Guide

### 1. Front Desk (Receptionist)

1. Open `/front-desk` and enter the receptionist access key.
2. Click **"+ New Session"** to create a race session (give it a name like "Race 1").
3. Add drivers (up to 8) by typing their name and clicking **"Add Driver"**.
4. Drivers are automatically assigned car numbers (1, 2, 3...).
5. Edit or remove drivers as needed.
6. Delete sessions with the **"Delete"** button.
7. Sessions disappear once the Safety Official starts that race.

### 2. Race Control (Safety Official)

1. Open `/race-control` and enter the safety access key.
2. When a session is ready, click the green **"Start: [Session Name]"** button.
3. The race begins with **Safe** mode (green flag). The countdown timer starts.
4. Use the mode buttons to control the race:
   - **Safe** (green) — normal racing
   - **Hazard** (yellow) — drive slowly
   - **Danger** (red) — stop driving
   - **Finish** (checkered) — proceed to pit lane
5. When timer hits zero, the race auto-finishes (changes to Finish mode).
6. After cars return, click **"End Session"** to end the session.
7. The next session appears automatically.

### 3. Lap-line Tracker (Observer)

1. Open `/lap-line-tracker` and enter the observer access key.
2. When a race is active, large numbered buttons appear for each car.
3. Tap the car's button each time it crosses the lap line.
4. The first tap starts the car's first lap; each subsequent tap records a new lap.
5. Buttons are disabled when no race is active.

### 4. Public Displays

- **Leader Board** (`/leader-board`): Shows all drivers sorted by fastest lap time, current lap count, remaining time, and flag status. Last race results persist until the next race starts.
- **Next Race** (`/next-race`): Shows the upcoming race session with driver names and car assignments. Displays "Proceed to the paddock" message when a session ends.
- **Race Countdown** (`/race-countdown`): Large countdown timer for spectators.
- **Race Flags** (`/race-flags`): Full-screen flag display — Green (safe), Yellow (hazard), Red (danger), Checkered (finish).

## Technology

- **Backend**: Node.js, Fastify, Socket.IO
- **Frontend**: React, Vite, Tailwind CSS
- **Real-time**: All communication uses Socket.IO (no polling)
- **State**: In-memory (resets on server restart)