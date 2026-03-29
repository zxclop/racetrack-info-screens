import { useState } from 'react';

interface AccessKeyFormProps {
  title: string;
  error: string;
  loading: boolean;
  onSubmit: (key: string) => void;
}

export default function AccessKeyForm({
  title,
  error,
  loading,
  onSubmit,
}: AccessKeyFormProps) {
  const [key, setKey] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  }

  return (
    <div className='isolate min-h-screen flex items-center justify-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden'>
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

      <div className='w-full max-w-sm'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-semibold tracking-tight text-white'>
            {title}
          </h1>
          <p className='mt-2 text-lg text-gray-400'>
            Enter your access key to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label
              htmlFor='access-key'
              className='block text-sm font-semibold text-white mb-2.5'
            >
              Access Key
            </label>
            <input
              id='access-key'
              type='password'
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder='Enter key...'
              className='block w-full rounded-md bg-white/5 px-3.5 py-2.5 text-base text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <p className='text-red-400 text-sm mb-4 text-center'>{error}</p>
          )}

          <button
            type='submit'
            disabled={loading || !key.trim()}
            className='block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg
                  className='animate-spin h-4 w-4'
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
                Validating...
              </span>
            ) : (
              'Unlock'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
