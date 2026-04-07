import ScreenShell from '../components/ScreenShell';
import { useRaceState } from '../hooks/useRaceState';

function formatMmSs(totalSeconds: number | null) {
  if (totalSeconds === null) return '--:--';
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
  const ss = String(clamped % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function RaceCountdownPage() {
  const raceState = useRaceState();

  return (
    <ScreenShell contentClassName='flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 ring-1 ring-inset ring-white/10'>
        <span>
          {raceState?.nextRace?.sessionName ?? 'Race'} •{' '}
          {raceState?.flagStatus ?? 'connecting…'}
        </span>
      </div>

      <div className='mt-6 text-[18vw] leading-none font-mono font-bold tracking-tight tabular-nums text-white drop-shadow-[0_0_24px_rgba(129,140,248,0.2)]'>
        {formatMmSs(raceState?.timer ?? null)}
      </div>
    </ScreenShell>
  );
}
