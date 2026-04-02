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

export default function LeaderBoardPage() {
  const raceState = useRaceState();

  const participants = [...(raceState?.participants ?? [])].sort(
    (a, b) => b.laps - a.laps || a.name.localeCompare(b.name)
  );

  const remaining = getRemainingSeconds(raceState?.startedAt ?? null);

  return (
    <ScreenShell>
      <div className='mx-auto max-w-5xl'>
        <div className='flex items-end justify-between gap-6'>
          <div>
            <h1 className='text-4xl font-semibold tracking-tight'>Leader Board</h1>
            <p className='mt-2 text-gray-400'>
              Session: {raceState?.sessionName ?? '—'} • Mode:{' '}
              {raceState?.mode ?? 'connecting…'}
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
                <th className='px-4 py-3'>Laps</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td className='px-4 py-6 text-gray-400' colSpan={3}>
                    No active race data yet.
                  </td>
                </tr>
              ) : (
                participants.map((p, idx) => (
                  <tr key={p.name} className='odd:bg-white/0 even:bg-white/5'>
                    <td className='px-4 py-3 font-mono text-gray-400'>{idx + 1}</td>
                    <td className='px-4 py-3 text-lg'>{p.name}</td>
                    <td className='px-4 py-3 text-lg font-semibold tabular-nums'>
                      {p.laps}
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
