import { useState } from 'react';
import type { RaceSession } from '../../types/types';
import { createSession } from '../../services/api';

interface SessionFormProps {
  onCreated: (session: RaceSession) => void;
}

export default function SessionForm({ onCreated }: SessionFormProps) {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    setError('');
    try {
      const now = new Date();
      const newSession = await createSession({
        name: name.trim(),
        racerNames: [],
        startTime: now.toISOString(),
        endTime: new Date(now.getTime() + 600000).toISOString(),
      });
      onCreated(newSession);
      setName('');
      setIsOpen(false);
    } catch {
      setError('Failed to create session. Is the server running?');
    }
    setLoading(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
      >
        + New Session
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 p-5'
    >
      <h2 className='text-sm font-semibold text-white mb-4'>
        Create New Session
      </h2>

      {error && <p className='text-red-400 text-sm mb-3'>{error}</p>}

      <div className='flex gap-3'>
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Session name (e.g. Race 1)'
            value={name}
            onChange={e => setName(e.target.value)}
            className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
            autoFocus
            disabled={loading}
          />
        </div>
        <button
          type='submit'
          disabled={loading || !name.trim()}
          className='rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        <button
          type='button'
          onClick={() => {
            setIsOpen(false);
            setError('');
          }}
          className='rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/20'
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
