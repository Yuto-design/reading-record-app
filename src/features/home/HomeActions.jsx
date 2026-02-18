import { Link } from 'react-router-dom';
import './styles/HomeActions.css';

function HomeActions() {
  return (
    <section className="home-actions">
      <Link to="/reading" className="home-action-card">
        <div className="home-action-card-content">
          <span className="home-action-icon" aria-hidden>
            <i className="fa-solid fa-book-open-reader"></i>
          </span>
          <h2 className="home-action-title">Reading Time</h2>
        </div>
        <p className="home-action-desc">タイマーで読書時間を計測・記録する</p>
      </Link>
      <Link to="/library" className="home-action-card">
        <div className="home-action-card-content">
          <span className="home-action-icon" aria-hidden>
            <i className="fa-solid fa-warehouse"></i>
          </span>
          <h2 className="home-action-title">My Library</h2>
        </div>
        <p className="home-action-desc">読んだ本・読みたい本を管理する</p>
      </Link>
    </section>
  );
}

export default HomeActions;
