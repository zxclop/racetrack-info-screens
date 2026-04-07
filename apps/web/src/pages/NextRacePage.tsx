import ScreenShell from '../components/ScreenShell';
import { useRaceState } from '../hooks/useRaceState';

export default function NextRacePage() {
  const raceState = useRaceState();

  const nextRace = raceState?.nextRace ?? null;
  const showProceed = raceState?.callToPaddock && nextRace;

  return (
    <ScreenShell>
      <div className='mx-auto max-w-5xl'>
        <h1 className='text-4xl font-semibold tracking-tight'>Next Race</h1>
        <p className='mt-2 text-gray-400'>
          Flag: {raceState?.flagStatus ?? 'connecting…'}
        </p>

        {showProceed && (
          <div className='mt-8 rounded-xl bg-green-600/20 ring-2 ring-green-500/40 p-6'>
            <div className='text-3xl font-bold text-green-400 animate-pulse'>
              🏁 Proceed to the paddock!
            </div>
            <div className='mt-3 text-gray-300 text-lg'>
              Next session: {nextRace.sessionName}
            </div>
            <div className='mt-6 grid gap-2'>
              {nextRace.participants.map(p => (
                <div
                  key={p.carNumber}
                  className='flex items-center gap-3 rounded bg-black/20 px-4 py-3 ring-1 ring-inset ring-white/10'
                >
                  <span className='bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white'>
                    {p.carNumber}
                  </span>
                  <span className='text-white'>{p.driverName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showProceed && (
          <div className='mt-8 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10'>
            <div className='text-sm text-gray-400'>Upcoming session</div>
            <div className='mt-2 text-3xl font-semibold'>
              {nextRace?.sessionName ?? 'No upcoming sessions'}
            </div>

            {nextRace && (
              <div className='mt-6 grid gap-2'>
                {nextRace.participants.map(p => (
                  <div
                    key={p.carNumber}
                    className='flex items-center gap-3 rounded bg-black/20 px-4 py-3 ring-1 ring-inset ring-white/10'
                  >
                    <span className='bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white'>
                      {p.carNumber}
                    </span>
                    <span className='text-white'>{p.driverName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
