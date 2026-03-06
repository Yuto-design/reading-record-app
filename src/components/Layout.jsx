import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isReading = location.pathname === '/reading';
  const isLibrary = location.pathname === '/library';
  const isStats = location.pathname === '/stats';
  const isCompleted = location.pathname === '/completed';
  const isSettings = location.pathname === '/settings';

  return (
    <div className={`layout layout--dark ${isHome ? 'layout--home' : ''}`}>
      <header className="layout-header">
        <h1 className="layout-title">
          <Link to="/">Reading Record</Link>
        </h1>
        <nav className="layout-nav">
          <Link
            to="/home"
            className={isHome ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            Home
          </Link>
          <Link
            to="/reading"
            className={isReading ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            Reading Time
          </Link>
          <Link
            to="/library"
            className={isLibrary ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            My Library
          </Link>
          <Link
            to="/stats"
            className={isStats ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            Stats
          </Link>
          <Link
            to="/completed"
            className={isCompleted ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            Completed
          </Link>
          <Link
            to="/settings"
            className={isSettings ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            Settings
          </Link>
        </nav>
      </header>
      <main className={`layout-main ${isHome ? 'layout-main--home' : ''} ${isLibrary ? 'layout-main--library' : ''} ${isStats ? 'layout-main--stats' : ''} ${isCompleted ? 'layout-main--completed' : ''} ${isSettings ? 'layout-main--settings' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
