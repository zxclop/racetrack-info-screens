import FullscreenButton from '../components/FullscreenButton';
import { useRaceState } from '../hooks/useRaceState';

function getFlagStyle(flagStatus: string | undefined) {
  switch (flagStatus) {
    case 'safe':
      return 'bg-green-600';
    case 'hazard':
      return 'bg-yellow-400';
    case 'danger':
      return 'bg-red-600';
    case 'finish':
      return 'bg-white bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%)] bg-[length:80px_80px] [background-position:0_0,40px_40px]';
    default:
      return 'bg-neutral-900';
  }
}

export default function RaceFlagsPage() {
  const raceState = useRaceState();
  const flagStatus = raceState?.flagStatus;

  return (
    <div className={`relative min-h-screen ${getFlagStyle(flagStatus)}`}>
      <div className='fixed right-4 top-4 z-20'>
        <FullscreenButton />
      </div>

      <div className='fixed bottom-4 left-4 rounded-md bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20'>
        {flagStatus ?? 'idle'}
      </div>
    </div>
  );
}
