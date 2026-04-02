import { useCallback, useEffect, useState } from 'react';

function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement);
}

export default function FullscreenButton() {
  const [active, setActive] = useState(isFullscreen());

  useEffect(() => {
    const onChange = () => setActive(isFullscreen());
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  }, []);

  return (
    <button
      type='button'
      onClick={() => void toggle()}
      className='rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:text-indigo-300'
    >
      {active ? 'Exit Fullscreen' : 'Fullscreen'}
    </button>
  );
}
