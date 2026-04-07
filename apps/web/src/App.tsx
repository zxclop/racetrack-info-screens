import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LeaderBoardPage from './pages/LeaderBoardPage';
import NextRacePage from './pages/NextRacePage';
import RaceCountdownPage from './pages/RaceCountdownPage';
import RaceFlagsPage from './pages/RaceFlagsPage';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Navigate to='/leader-board' replace />} />
        <Route path='/leader-board' element={<LeaderBoardPage />} />
        <Route path='/next-race' element={<NextRacePage />} />
        <Route path='/race-countdown' element={<RaceCountdownPage />} />
        <Route path='/race-flags' element={<RaceFlagsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
