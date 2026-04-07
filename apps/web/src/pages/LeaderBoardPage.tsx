import ScreenShell from '../components/ScreenShell';
import { useRaceState } from '../hooks/useRaceState';

function formatMmSs(totalSeconds: number | null) {
  if (totalSeconds === null) return '--:--';
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
  const ss = String(clamped % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function formatLapTime(timeMs: number | null): string {
  if (timeMs === null) return '—';
  const totalSeconds = timeMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
}

function getFlagColor(flagStatus: string | undefined): string {
  switch (flagStatus) {
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

export default function LeaderBoardPage() {
  const raceState = useRaceState();

  const isActive =
    raceState &&
    ['safe', 'hazard', 'danger', 'finish'].includes(raceState.status);
  const showLastRace =
    raceState &&
    (raceState.status === 'idle' || raceState.status === 'ended') &&
    raceState.lastRace;

  const leaderboard = isActive
    ? raceState.leaderboard
    : showLastRace
      ? raceState.lastRace!.leaderboard
      : (raceState?.leaderboard ?? []);

  const flagColor = getFlagColor(raceState?.flagStatus);

  return (
    <ScreenShell>
      <div className='mx-auto max-w-5xl'>
        <div className='flex items-end justify-between gap-6'>
          <div>
            <h1 className='text-4xl font-semibold tracking-tight'>
              Leader Board
            </h1>
            <p className='mt-2 text-gray-400'>
              {showLastRace
                ? `Last Race: ${raceState.lastRace!.sessionName}`
                : `Session: ${raceState?.nextRace?.sessionName ?? '—'}`}{' '}
              • Flag:{' '}
              <span className='inline-flex items-center gap-2'>
                <span
                  className={`inline-block h-3 w-3 rounded-full ${flagColor}`}
                />
                {raceState?.flagStatus ?? 'connecting…'}
              </span>
            </p>
          </div>
          <div className='text-right'>
            <div className='text-sm text-gray-400'>Remaining</div>
            <div className='text-5xl font-mono font-bold tabular-nums'>
              {formatMmSs(raceState?.timer ?? null)}
            </div>
          </div>
        </div>

        <div className='mt-8 overflow-hidden rounded-lg bg-white/5 ring-1 ring-inset ring-white/10'>
          <table className='w-full border-separate border-spacing-0'>
            <thead className='bg-white/5 text-left text-sm text-gray-300'>
              <tr>
                <th className='px-4 py-3'>#</th>
                <th className='px-4 py-3'>Car</th>
                <th className='px-4 py-3'>Driver</th>
                <th className='px-4 py-3'>Laps</th>
                <th className='px-4 py-3'>Best Lap</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td className='px-4 py-6 text-gray-400' colSpan={5}>
                    No active race data yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((p, idx) => (
                  <tr
                    key={p.carNumber}
                    className='odd:bg-white/0 even:bg-white/5'
                  >
                    <td className='px-4 py-3 font-mono text-gray-400'>
                      {idx + 1}
                    </td>
                    <td className='px-4 py-3 text-lg font-semibold'>
                      {p.carNumber}
                    </td>
                    <td className='px-4 py-3 text-lg'>{p.driverName}</td>
                    <td className='px-4 py-3 text-lg tabular-nums'>{p.laps}</td>
                    <td className='px-4 py-3 text-lg font-semibold tabular-nums'>
                      {formatLapTime(p.bestLapTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScreenShell>
  );
}
