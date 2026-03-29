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

    socket.on('race:state', (data: RaceState) => {
      setRaceState(data);
    });

    socket.on('race:updated', (data: RaceState) => {
      setRaceState(data);
    });

    return () => {
      socket.off('race:state');
      socket.off('race:updated');
      socket.disconnect();
    };
  }, [authKey, role]);

  return raceState;
}
