import { NavLink } from 'react-router-dom';

const links = [
  { to: '/leader-board', label: 'Leaderboard' },
  { to: '/next-race', label: 'Next Race' },
  { to: '/race-countdown', label: 'Countdown' },
  { to: '/race-flags', label: 'Flags' },
];

export default function NavBar() {
  return (
    <nav className='fixed top-0 left-0 right-0 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-4 py-2'>
      <span className='text-white/70 text-sm font-bold mr-4 tracking-wider'>
        BEACHSIDE
      </span>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
