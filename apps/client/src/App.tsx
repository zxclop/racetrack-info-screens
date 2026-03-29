import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FrontDeskPage from './pages/FrontDesk/FrontDeskPage';
import LapTrackerPage from './pages/LapTracker/LapTrackerPage';
import RaceControlPage from './pages/RaceControl/RaceControlPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Employee Interfaces */}
        <Route path='/front-desk' element={<FrontDeskPage />} />
        <Route path='/race-control' element={<RaceControlPage />} />
        <Route path='/lap-line-tracker' element={<LapTrackerPage />} />

        {/* Home */}
        <Route
          path='/'
          element={
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

              <div className='mx-auto max-w-xl px-6 py-16 sm:py-24'>
                <h1 className='text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl'>
                  Beachside Racetrack
                </h1>
                <p className='mt-4 text-lg text-gray-400'>
                  Employee admin interfaces
                </p>

                <div className='mt-10 flex flex-col gap-3'>
                  <Link
                    to='/front-desk'
                    className='group rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 px-5 py-4 hover:bg-white/10 transition-colors'
                  >
                    <p className='text-sm font-semibold text-white group-hover:text-indigo-400'>
                      Front Desk
                    </p>
                    <p className='text-sm text-gray-400'>
                      Manage sessions & register drivers
                    </p>
                  </Link>
                  <Link
                    to='/race-control'
                    className='group rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 px-5 py-4 hover:bg-white/10 transition-colors'
                  >
                    <p className='text-sm font-semibold text-white group-hover:text-indigo-400'>
                      Race Control
                    </p>
                    <p className='text-sm text-gray-400'>
                      Start races & change safety modes
                    </p>
                  </Link>
                  <Link
                    to='/lap-line-tracker'
                    className='group rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 px-5 py-4 hover:bg-white/10 transition-colors'
                  >
                    <p className='text-sm font-semibold text-white group-hover:text-indigo-400'>
                      Lap-line Tracker
                    </p>
                    <p className='text-sm text-gray-400'>
                      Record laps as cars cross the line
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
