import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const navItems = [
  { to: '/home', label: 'Home', isActive: (path) => path === '/home' || path === '/', icon: HomeIcon },
  { to: '/reading', label: 'Reading Time', isActive: (path) => path === '/reading', icon: ReadingIcon },
  { to: '/library', label: 'My Library', isActive: (path) => path === '/library', icon: LibraryIcon },
  { to: '/stats', label: 'Stats', isActive: (path) => path === '/stats', icon: StatsIcon },
  { to: '/completed', label: 'Completed', isActive: (path) => path === '/completed', icon: CompletedIcon },
  { to: '/settings', label: 'Settings', isActive: (path) => path === '/settings', icon: SettingsIcon },
];

function HomeIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function ReadingIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="12" y1="6" x2="12" y2="12" />
      <line x1="9" y1="9" x2="15" y2="9" />
    </svg>
  );
}
function StatsIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function CompletedIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="layout-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function Layout() {
  const location = useLocation();

  return (
    <div className={`layout layout--dark ${location.pathname === '/home' || location.pathname === '/' ? 'layout--home' : ''}`}>
      <header className="layout-header">
        <h1 className="layout-title">
          <Link to="/">Reading Record</Link>
        </h1>
        <nav className="layout-nav" aria-label="メインナビゲーション">
          {navItems.map(({ to, label, isActive, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={isActive(location.pathname) ? 'layout-nav-link active' : 'layout-nav-link'}
              aria-label={label}
              title={label}
            >
              <Icon />
              <span className="layout-nav-tooltip" aria-hidden>{label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <main className={`layout-main ${location.pathname === '/' || location.pathname === '/home' ? 'layout-main--home' : ''} ${location.pathname === '/library' ? 'layout-main--library' : ''} ${location.pathname === '/stats' ? 'layout-main--stats' : ''} ${location.pathname === '/completed' ? 'layout-main--completed' : ''} ${location.pathname === '/settings' ? 'layout-main--settings' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
