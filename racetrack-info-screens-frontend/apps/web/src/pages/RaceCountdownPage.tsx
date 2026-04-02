import { useEffect, useMemo, useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import { useRaceState } from '../hooks/useRaceState';

const PROD_DURATION_SECONDS = 600;
const DEV_DURATION_SECONDS = 60;

function formatMmSs(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
  const ss = String(clamped % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getRemainingSeconds(startedAt: string | null): number {
  const duration = import.meta.env.DEV
    ? DEV_DURATION_SECONDS
    : PROD_DURATION_SECONDS;

  if (!startedAt) return duration;
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  return Math.max(0, duration - elapsed);
}

export default function RaceCountdownPage() {
  const raceState = useRaceState();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    void tick;
    return getRemainingSeconds(raceState?.startedAt ?? null);
  }, [raceState?.startedAt, tick]);

  return (
    <ScreenShell contentClassName='flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 ring-1 ring-inset ring-white/10'>
        <span>
          {raceState?.sessionName ?? 'Race'} • {raceState?.mode ?? 'connecting…'}
        </span>
      </div>

      <div className='mt-6 text-[18vw] leading-none font-mono font-bold tracking-tight tabular-nums text-white drop-shadow-[0_0_24px_rgba(129,140,248,0.2)]'>
        {formatMmSs(remaining)}
      </div>
    </ScreenShell>
  );
}
