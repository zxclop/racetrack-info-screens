import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import type { RaceState } from '../types/types';

/**
 * Public screens: no auth, read-only.
 * Subscribes to `race-control:state` and keeps the latest state.
 */
export function useRaceState() {
  const [raceState, setRaceState] = useState<RaceState | null>(null);

  useEffect(() => {
    socket.auth = {};
    socket.connect();

    const handler = (data: RaceState) => {
      setRaceState(data);
    };

    socket.on('race-control:state', handler);

    return () => {
      socket.off('race-control:state', handler);
      socket.disconnect();
    };
  }, []);

  return raceState;
}
