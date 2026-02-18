import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const isReading = location.pathname === '/reading' || location.pathname === '/';
  const isLibrary = location.pathname === '/library';

  return (
    <div className="layout">
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
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
