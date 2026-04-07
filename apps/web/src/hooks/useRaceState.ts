import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import type { RaceState } from '../types/types';

export function useRaceState() {
  const [raceState, setRaceState] = useState<RaceState | null>(null);

  useEffect(() => {
    socket.auth = {};
    socket.connect();

    const handler = (data: RaceState) => {
      setRaceState(data);
    };

    socket.on('race:state', handler);
    socket.on('race:updated', handler);

    return () => {
      socket.off('race:state', handler);
      socket.off('race:updated', handler);
      socket.disconnect();
    };
  }, []);

  return raceState;
}
