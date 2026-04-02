import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import type { RaceState } from '../types/types';

export function useRaceState(authKey?: string | null, role?: string) {
  const [raceState, setRaceState] = useState<RaceState | null>(null);

  useEffect(() => {
    // For protected pages, wait until key is available
    if (role && !authKey) return;

    if (role && authKey) {
      socket.auth = { key: authKey, role };
    } else {
      socket.auth = {};
    }

    socket.connect();

    socket.on('race-control:state', (data: RaceState) => {
      setRaceState(data);
    });

    return () => {
      socket.off('race-control:state');
      socket.disconnect();
    };
  }, [authKey, role]);

  return raceState;
}
