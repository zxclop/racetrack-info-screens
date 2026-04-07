import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { deleteSession, getSessions } from '../../services/api';
import type { RaceSession } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useRaceState } from '../../hooks/useRaceState';
import AccessKeyForm from '../../components/AccessKeyForm';
import SessionForm from './SessionForm';
import DriverList from './DriverList';

export default function FrontDeskPage() {
  const {
    accessKey,
    isAuthenticated,
    error: authError,
    loading: authLoading,
    submitKey,
  } = useAuth('receptionist');
  const raceState = useRaceState(accessKey, 'receptionist');
  const [sessions, setSessions] = useState<RaceSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    const data = await getSessions();
    setSessions(data);
    setLoadingSessions(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadSessions();
  }, [isAuthenticated, loadSessions]);

  // Refresh sessions whenever race state changes (session started/ended)
  useEffect(() => {
    if (!isAuthenticated || !raceState) return;
    loadSessions();
  }, [raceState?.sessionId, raceState?.status, isAuthenticated, loadSessions]);

  if (!isAuthenticated) {
    return (
      <AccessKeyForm
        title='Front Desk'
        error={authError}
        loading={authLoading}
        onSubmit={submitKey}
      />
    );
  }

  function handleSessionCreated(newSession: RaceSession) {
    setSessions(prev => [...prev, newSession]);
    setError('');
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this session?')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteSession(id);
      setSessions(prev => prev.filter(session => session.id !== id));
    } catch {
      setError('Failed to delete session. Is the server running?');
    }
    setDeletingId(null);
  }

  function handleDriverUpdated(sessionId: string, updatedNames: string[]) {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, racerNames: updatedNames } : s
      )
    );
  }

  return (
    <div className='isolate min-h-screen bg-gray-900 px-6 py-12 sm:py-16 lg:px-8 relative overflow-hidden'>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className='relative left-1/2 -z-10 aspect-1155/678 w-xl max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-6xl'
        />
      </div>

      <div className='mx-auto max-w-2xl'>
        <Link
          to='/'
          className='inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4'
        >
          ← Back
        </Link>
        <h1 className='text-4xl font-semibold tracking-tight text-white mb-2'>
          Front Desk
        </h1>
        <p className='text-lg text-gray-400 mb-8'>
          Manage upcoming race sessions and drivers
        </p>

        {error && (
          <div className='rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 mb-6'>
            <p className='text-sm text-red-400'>{error}</p>
          </div>
        )}

        <SessionForm onCreated={handleSessionCreated} />

        <h2 className='text-xl font-semibold text-white mt-10 mb-4'>
          Upcoming Sessions ({sessions.length})
        </h2>

        {loadingSessions && (
          <div className='flex items-center gap-2 text-gray-400 py-8'>
            <svg
              className='animate-spin h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
              />
            </svg>
            Loading sessions...
          </div>
        )}

        {!loadingSessions && sessions.length === 0 && (
          <p className='text-gray-500 py-8 text-center'>
            No upcoming sessions. Create one above.
          </p>
        )}

        <div className='space-y-4'>
          {sessions.map(session => (
            <div
              key={session.id}
              className='rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 p-5'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-semibold text-white'>
                    {session.name}
                  </h3>
                  <p className='text-sm text-gray-400 mt-0.5'>
                    {session.racerNames.length} driver
                    {session.racerNames.length !== 1 ? 's' : ''} registered
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(session.id)}
                  disabled={deletingId === session.id}
                  className='text-sm text-red-400 hover:text-red-300 disabled:opacity-50'
                >
                  {deletingId === session.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <DriverList
                sessionId={session.id}
                racerNames={session.racerNames}
                onUpdated={names => handleDriverUpdated(session.id, names)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
