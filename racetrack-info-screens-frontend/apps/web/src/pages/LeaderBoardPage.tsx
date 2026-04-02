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

function getFlagColor(mode: string | undefined): string {
  switch (mode) {
    case 'safe':
      return 'bg-green-600';
    case 'hazard':
      return 'bg-yellow-400';
    case 'danger':
      return 'bg-red-600';
    case 'finish':
      return 'bg-checkered';
    default:
      return 'bg-gray-600';
  }
}

function parseLapTime(timeStr?: string): number {
  if (!timeStr) return Infinity;
  // Expected format: "MM:SS.mmm" or "MM:SS"
  const parts = timeStr.split(':');
  if (parts.length !== 2) return Infinity;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseFloat(parts[1]);
  return minutes * 60 + seconds;
}

export default function LeaderBoardPage() {
  const raceState = useRaceState();

  // Sort by fastest lap time if available, otherwise by lap count
  const participants = [...(raceState?.participants ?? [])].sort((a, b) => {
    const aTime = parseLapTime(a.fastestLapTime);
    const bTime = parseLapTime(b.fastestLapTime);
    
    // If both have lap times, sort by time
    if (aTime !== Infinity && bTime !== Infinity) {
      if (aTime !== bTime) return aTime - bTime;
    }
    // Fallback: sort by lap count (descending), then by name
    if (b.laps !== a.laps) return b.laps - a.laps;
    return a.name.localeCompare(b.name);
  });

  const remaining = getRemainingSeconds(raceState?.startedAt ?? null);
  const flagColor = getFlagColor(raceState?.mode);

  return (
    <ScreenShell>
      <div className='mx-auto max-w-5xl'>
        <div className='flex items-end justify-between gap-6'>
          <div>
            <h1 className='text-4xl font-semibold tracking-tight'>Leader Board</h1>
            <p className='mt-2 text-gray-400'>
              Session: {raceState?.sessionName ?? '—'} • Mode:{' '}
              <span className='inline-flex items-center gap-2'>
                <span className={`inline-block h-3 w-3 rounded-full ${flagColor}`} />
                {raceState?.mode ?? 'connecting…'}
              </span>
            </p>
          </div>
          <div className='text-right'>
            <div className='text-sm text-gray-400'>Remaining</div>
            <div className='text-5xl font-mono font-bold tabular-nums'>
              {formatMmSs(remaining)}
            </div>
          </div>
        </div>

        <div className='mt-8 overflow-hidden rounded-lg bg-white/5 ring-1 ring-inset ring-white/10'>
          <table className='w-full border-separate border-spacing-0'>
            <thead className='bg-white/5 text-left text-sm text-gray-300'>
              <tr>
                <th className='px-4 py-3'>#</th>
                <th className='px-4 py-3'>Driver</th>
                {participants.some(p => p.carNumber) && (
                  <th className='px-4 py-3'>Car</th>
                )}
                {participants.some(p => p.fastestLapTime) ? (
                  <th className='px-4 py-3'>Best Lap</th>
                ) : (
                  <th className='px-4 py-3'>Laps</th>
                )}
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td className='px-4 py-6 text-gray-400' colSpan={participants.some(p => p.carNumber) ? 4 : 3}>
                    No active race data yet.
                  </td>
                </tr>
              ) : (
                participants.map((p, idx) => (
                  <tr key={p.name} className='odd:bg-white/0 even:bg-white/5'>
                    <td className='px-4 py-3 font-mono text-gray-400'>{idx + 1}</td>
                    <td className='px-4 py-3 text-lg'>{p.name}</td>
                    {participants.some(p => p.carNumber) && (
                      <td className='px-4 py-3 text-lg font-semibold'>{p.carNumber ?? '—'}</td>
                    )}
                    <td className='px-4 py-3 text-lg font-semibold tabular-nums'>
                      {p.fastestLapTime ?? `${p.laps} laps`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='mt-6 rounded-lg bg-white/5 px-4 py-3 ring-1 ring-inset ring-white/10'>
          <div className='text-sm text-gray-400'>Best lap (session)</div>
          <div className='mt-1 text-lg'>
            {raceState?.bestLap
              ? `${raceState.bestLap.time} — ${raceState.bestLap.racerName}`
              : '—'}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
