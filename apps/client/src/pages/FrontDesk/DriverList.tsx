import { useState } from 'react';
import { updateSession } from '../../services/api';

interface DriverListProps {
  sessionId: string;
  racerNames: string[];
  onUpdated: (updatedNames: string[]) => void;
}

export default function DriverList({
  sessionId,
  racerNames,
  onUpdated,
}: DriverListProps) {
  const [newDriver, setNewDriver] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd() {
    const trimmed = newDriver.trim();
    if (!trimmed || saving) return;
    if (racerNames.includes(trimmed)) {
      setError('Name already exists');
      return;
    }
    if (racerNames.length >= 8) return;

    setSaving(true);
    setError('');
    try {
      const updated = [...racerNames, trimmed];
      await updateSession(sessionId, { racerNames: updated });
      onUpdated(updated);
      setNewDriver('');
    } catch {
      setError('Failed to add driver');
    }
    setSaving(false);
  }

  async function handleRemove(name: string) {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const updated = racerNames.filter(n => n !== name);
      await updateSession(sessionId, { racerNames: updated });
      onUpdated(updated);
    } catch {
      setError('Failed to remove driver');
    }
    setSaving(false);
  }

  async function handleEdit(index: number) {
    const trimmed = editName.trim();
    if (!trimmed || saving) return;
    if (trimmed !== racerNames[index] && racerNames.includes(trimmed)) {
      setError('Name already exists');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const updated = [...racerNames];
      updated[index] = trimmed;
      await updateSession(sessionId, { racerNames: updated });
      onUpdated(updated);
      setEditingIndex(null);
      setEditName('');
    } catch {
      setError('Failed to update driver');
    }
    setSaving(false);
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditName(racerNames[index]);
    setError('');
  }

  return (
    <div className='mt-4'>
      <h4 className='text-sm/6 font-semibold text-gray-400 mb-2'>
        Drivers & Cars
      </h4>

      {error && <p className='text-red-400 text-sm mb-2'>{error}</p>}

      <div className='space-y-1.5'>
        {racerNames.map((name, index) => (
          <div key={index} className='flex items-center gap-3 py-1.5'>
            <span className='bg-indigo-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0'>
              {index + 1}
            </span>

            {editingIndex === index ? (
              <div className='flex gap-2 flex-1'>
                <input
                  type='text'
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEdit(index)}
                  className='block flex-1 rounded-md bg-white/5 px-3 py-1.5 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
                  autoFocus
                  disabled={saving}
                />
                <button
                  onClick={() => handleEdit(index)}
                  disabled={saving}
                  className='text-indigo-400 text-sm font-medium hover:text-indigo-300 disabled:opacity-50'
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className='text-gray-400 text-sm hover:text-gray-300'
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className='flex-1 text-sm text-white'>{name}</span>
                <button
                  onClick={() => startEdit(index)}
                  disabled={saving}
                  className='text-indigo-400 text-sm hover:text-indigo-300 disabled:opacity-50'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(name)}
                  disabled={saving}
                  className='text-red-400 text-sm hover:text-red-300 disabled:opacity-50'
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {racerNames.length < 8 && (
        <div className='flex gap-2 mt-3'>
          <input
            type='text'
            placeholder='Driver name'
            value={newDriver}
            onChange={e => setNewDriver(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className='block flex-1 rounded-md bg-white/5 px-3.5 py-2 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
            disabled={saving}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newDriver.trim()}
            className='rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {saving ? 'Saving...' : 'Add Driver'}
          </button>
        </div>
      )}

      {racerNames.length >= 8 && (
        <p className='text-yellow-400 text-xs mt-2'>
          Maximum 8 drivers reached
        </p>
      )}
    </div>
  );
}
