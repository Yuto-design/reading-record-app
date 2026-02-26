import { Link } from 'react-router-dom';
import './styles/HomeHero.css';

function HomeHero() {
  return (
    <header className="home-hero">
      <h1 className="home-title">Reading Record</h1>
      <p className="home-subtitle">読書の記録を残して、習慣を育てよう</p>
      <nav className="home-hero-nav" aria-label="メイン機能">
        <Link
          to="/reading"
          className="home-hero-nav-link"
          title="タイマーで読書時間を計測・記録する"
        >
          <i className="fa-solid fa-book-open-reader" aria-hidden />
          <span>Reading Time</span>
        </Link>
        <Link
          to="/library"
          className="home-hero-nav-link"
          title="読んだ本・読みたい本を管理する"
        >
          <i className="fa-solid fa-warehouse" aria-hidden />
          <span>My Library</span>
        </Link>
      </nav>
    </header>
  );
}

export default HomeHero;
