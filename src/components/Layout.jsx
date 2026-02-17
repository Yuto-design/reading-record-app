import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const isReading = location.pathname === '/reading' || location.pathname === '/';
  const isLibrary = location.pathname === '/library';

  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">
          <Link to="/">読書記録</Link>
        </h1>
        <nav className="layout-nav">
          <Link
            to="/reading"
            className={isReading ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            読書時間
          </Link>
          <Link
            to="/library"
            className={isLibrary ? 'layout-nav-link active' : 'layout-nav-link'}
          >
            図書館
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
