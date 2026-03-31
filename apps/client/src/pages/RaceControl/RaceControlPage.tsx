import { useState, useEffect } from 'react';
import { useRaceState } from '../../hooks/useRaceState';
import { useAuth } from '../../hooks/useAuth';
import { socket } from '../../services/socket';
import AccessKeyForm from '../../components/AccessKeyForm';

const modeButtons = [
  {
    mode: 'safe',
    label: 'Safe',
    color: 'bg-green-600',
    activeRing: 'ring-green-400/60',
    activeBg: 'bg-green-500',
  },
  {
    mode: 'hazard',
    label: 'Hazard',
    color: 'bg-yellow-600',
    activeRing: 'ring-yellow-400/60',
    activeBg: 'bg-yellow-500',
  },
  {
    mode: 'danger',
    label: 'Danger',
    color: 'bg-red-600',
    activeRing: 'ring-red-400/60',
    activeBg: 'bg-red-500',
  },
  {
    mode: 'finish',
    label: 'Finish',
    color: 'bg-gray-600',
    activeRing: 'ring-gray-400/60',
    activeBg: 'bg-gray-500',
  },
];

function computeElapsed(startedAt: string | null): number | null {
  if (!startedAt) return null;
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
}

function formatTimer(seconds: number | null): string {
  if (seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function RaceControlPage() {
  const {
    accessKey,
    isAuthenticated,
    error: authError,
    loading: authLoading,
    submitKey,
  } = useAuth('safety');
  const raceState = useRaceState(accessKey, 'safety');
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    if (!raceState?.startedAt || raceState.mode === 'ended') {
      setElapsed(null);
      return;
    }
    setElapsed(computeElapsed(raceState.startedAt));
    const interval = setInterval(() => {
      setElapsed(computeElapsed(raceState.startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [raceState?.startedAt, raceState?.mode]);

  if (!isAuthenticated) {
    return (
      <AccessKeyForm
        title='Race Control'
        error={authError}
        loading={authLoading}
        onSubmit={submitKey}
      />
    );
  }

  if (!raceState)
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='flex items-center gap-3'>
          <svg
            className='animate-spin h-5 w-5 text-indigo-400'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
            ></path>
          </svg>
          <p className='text-gray-400'>Connecting to server...</p>
        </div>
      </div>
    );

  function handleStart() {
    socket.emit('race-control:start', { sessionId: raceState!.sessionId });
  }

  function handleEndSession() {
    if (!confirm('End the current session?')) return;
    socket.emit('race-control:end-session');
  }

  function handleModeChange(mode: string) {
    socket.emit('race-control:set-mode', { mode });
  }

  const isRacing = ['safe', 'hazard', 'danger'].includes(raceState.mode);
  const isFinished = raceState.mode === 'finish';

  return (
    <div className='relative isolate min-h-screen bg-gray-900 text-white'>
      {/* Decorative gradient blur */}
      <div
        className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
        aria-hidden='true'
      >
        <div
          className='relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75'
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>

      <div className='px-4 py-6 max-w-md mx-auto'>
        <h1 className='text-2xl font-semibold tracking-tight text-white text-center mb-3'>
          Race Control
        </h1>

        {/* Status Badge */}
        <div className='text-center mb-4'>
          <span
            className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
              raceState.mode === 'safe'
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                : raceState.mode === 'hazard'
                  ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30'
                  : raceState.mode === 'danger'
                    ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                    : raceState.mode === 'finish'
                      ? 'bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30'
                      : 'bg-white/5 text-gray-400 ring-1 ring-white/10'
            }`}
          >
            {raceState.mode}
          </span>
        </div>

        {/* Timer */}
        {(isRacing || isFinished) && (
          <div className='text-center mb-6'>
            <p className='text-6xl font-mono font-bold tabular-nums text-white'>
              {formatTimer(elapsed)}
            </p>
          </div>
        )}

        {/* Participants */}
        {raceState.sessionId && raceState.participants.length > 0 && (
          <div className='rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 p-4 mb-5'>
            <h3 className='text-sm/6 font-semibold text-gray-400 mb-2'>
              Participants
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              {raceState.participants.map((p, i) => (
                <div key={i} className='flex items-center gap-2 text-sm'>
                  <span className='bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white'>
                    {i + 1}
                  </span>
                  <span className='text-gray-200'>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle — Start Race */}
        {raceState.mode === 'idle' && (
          <div className='flex flex-col items-center gap-4 mt-8'>
            {raceState.sessionId ? (
              <button
                onClick={handleStart}
                className='rounded-xl bg-green-600 hover:bg-green-500 text-white text-xl font-bold px-12 py-6 shadow-lg w-full max-w-xs transition-colors'
              >
                Start Race
              </button>
            ) : (
              <p className='text-gray-500 text-center'>
                No upcoming race sessions
              </p>
            )}
          </div>
        )}

        {/* Racing — Mode Buttons */}
        {isRacing && (
          <div className='grid grid-cols-2 gap-3 max-w-sm mx-auto'>
            {modeButtons.map(btn => (
              <button
                key={btn.mode}
                onClick={() => handleModeChange(btn.mode)}
                className={`text-white text-lg font-bold py-6 rounded-xl transition-all select-none ${
                  raceState.mode === btn.mode
                    ? `${btn.activeBg} ring-4 ${btn.activeRing} shadow-lg`
                    : `${btn.color} opacity-70 hover:opacity-90`
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Finish — End Session */}
        {isFinished && (
          <div className='flex flex-col items-center gap-4 mt-4'>
            <div className='rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/30 p-4 text-center'>
              <p className='text-yellow-400 font-medium'>
                Race finished — waiting for cars to return to pit lane
              </p>
            </div>
            <button
              onClick={handleEndSession}
              className='rounded-xl bg-red-600 hover:bg-red-500 text-white text-xl font-bold px-12 py-6 shadow-lg w-full max-w-xs transition-colors'
            >
              End Session
            </button>
          </div>
        )}

        {/* Ended */}
        {raceState.mode === 'ended' && (
          <p className='text-gray-500 text-center mt-8'>Session ended</p>
        )}
      </div>
    </div>
  );
}
