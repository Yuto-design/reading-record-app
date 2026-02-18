import { Link } from 'react-router-dom';

function HomeActions() {
  return (
    <section className="home-actions">
      <Link to="/reading" className="home-action-card">
        <span className="home-action-icon" aria-hidden>📖</span>
        <h2 className="home-action-title">Reading Time</h2>
        <p className="home-action-desc">タイマーで読書時間を計測・記録する</p>
      </Link>
      <Link to="/library" className="home-action-card">
        <span className="home-action-icon" aria-hidden>📚</span>
        <h2 className="home-action-title">My Library</h2>
        <p className="home-action-desc">読んだ本・読みたい本を管理する</p>
      </Link>
    </section>
  );
}

export default HomeActions;
