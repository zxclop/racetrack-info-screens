import { useEffect, useMemo, useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import { useRaceState } from '../hooks/useRaceState';
import { getSessions } from '../services/api';
import type { RaceSession } from '../types/types';

function toSortableTime(value: string): number {
  const t = Date.parse(value);
  if (Number.isFinite(t)) return t;
  return Number.POSITIVE_INFINITY;
}

export default function NextRacePage() {
  const raceState = useRaceState();
  const [sessions, setSessions] = useState<RaceSession[]>([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const items = await getSessions();
      if (cancelled) return;
      setSessions(items);
    };

    void run();

    return () => {
      cancelled = true;
    };
    // Refresh list when race session changes
  }, [raceState?.sessionId, raceState?.mode]);

  const sorted = useMemo(() => {
    return [...sessions].sort(
      (a, b) => toSortableTime(a.startTime) - toSortableTime(b.startTime)
    );
  }, [sessions]);

  const currentId = raceState?.sessionId ?? null;
  const nextSession = sorted.find((s) => s.id !== currentId) ?? null;

  const showProceed = raceState?.mode === 'ended' && raceState.sessionName;

  return (
    <ScreenShell>
      <div className='mx-auto max-w-5xl'>
        <h1 className='text-4xl font-semibold tracking-tight'>Next Race</h1>
        <p className='mt-2 text-gray-400'>Mode: {raceState?.mode ?? 'connecting…'}</p>

        {showProceed ? (
          <div className='mt-8 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10'>
            <div className='text-3xl font-semibold'>Proceed to the paddock</div>
            <div className='mt-3 text-gray-300'>Current session: {raceState.sessionName}</div>
            <div className='mt-6 grid gap-2'>
              {(raceState.participants ?? []).map((p) => (
                <div
                  key={p.name}
                  className='rounded bg-black/20 px-4 py-3 ring-1 ring-inset ring-white/10'
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='mt-8 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10'>
            <div className='text-sm text-gray-400'>Upcoming session</div>
            <div className='mt-2 text-3xl font-semibold'>
              {nextSession?.name ?? 'No sessions yet'}
            </div>

            {nextSession && (
              <>
                <div className='mt-2 text-gray-400'>
                  {nextSession.startTime} — {nextSession.endTime}
                </div>
                <div className='mt-6 grid gap-2'>
                  {nextSession.racerNames.map((name) => (
                    <div
                      key={name}
                      className='rounded bg-black/20 px-4 py-3 ring-1 ring-inset ring-white/10'
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
