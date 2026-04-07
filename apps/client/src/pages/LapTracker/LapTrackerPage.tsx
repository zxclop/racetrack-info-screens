import { Link } from 'react-router-dom';
import { useRaceState } from '../../hooks/useRaceState';
import { useAuth } from '../../hooks/useAuth';
import { socket } from '../../services/socket';
import AccessKeyForm from '../../components/AccessKeyForm';

export default function LapTrackerPage() {
  const {
    accessKey,
    isAuthenticated,
    error: authError,
    loading: authLoading,
    submitKey,
  } = useAuth('observer');
  const raceState = useRaceState(accessKey, 'observer');

  if (!isAuthenticated) {
    return (
      <AccessKeyForm
        title='Lap-line Tracker'
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

  function handleLap(racerName: string) {
    socket.emit('lap:record', { racerName });
  }

  const isRacing = ['safe', 'hazard', 'danger', 'finish'].includes(
    raceState.status
  );
  const isEnded = raceState.status === 'ended' || raceState.status === 'idle';
  const cars = raceState.participants;

  return (
    <div className='relative isolate min-h-screen bg-gray-900 text-white flex flex-col'>
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

      <div className='px-4 py-6 flex flex-col flex-1'>
        <div className='mb-2'>
          <Link
            to='/'
            className='inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors'
          >
            ← Back
          </Link>
        </div>
        <h1 className='text-xl font-semibold tracking-tight text-white text-center mb-2'>
          Lap-line Tracker
        </h1>

        {/* Status */}
        <div className='text-center mb-4'>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isRacing
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                : 'bg-white/5 text-gray-400 ring-1 ring-white/10'
            }`}
          >
            {raceState.status}
          </span>
        </div>

        {/* Ended message */}
        {raceState.status === 'ended' && (
          <div className='rounded-lg bg-red-500/10 ring-1 ring-red-500/30 p-4 mb-4 text-center'>
            <p className='text-red-400 font-bold text-lg'>Session Ended</p>
            <p className='text-red-400/70 text-sm'>Waiting for next race...</p>
          </div>
        )}

        {/* Waiting message */}
        {raceState.status === 'idle' && (
          <div className='flex-1 flex items-center justify-center'>
            <p className='text-gray-500 text-center text-lg'>
              Waiting for race to start...
            </p>
          </div>
        )}

        {/* Car buttons grid — large tappable areas, responsive for tablet */}
        {cars.length > 0 && (
          <div className='flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr'>
            {cars.map(car => (
              <button
                key={car.carNumber}
                onClick={() => handleLap(car.driverName)}
                disabled={isEnded}
                className={`rounded-xl font-bold flex flex-col items-center justify-center min-h-35 transition-all select-none ${
                  isEnded
                    ? 'bg-white/5 ring-1 ring-inset ring-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:scale-95 text-white shadow-lg'
                }`}
              >
                <span className='text-5xl leading-none'>{car.carNumber}</span>
                <span className='text-sm font-normal mt-2 opacity-70'>
                  {car.driverName}
                </span>
                <span className='text-xs font-normal opacity-50'>
                  Laps: {car.laps}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
