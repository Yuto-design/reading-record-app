import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getReadingSessions } from '../../utils/storage';
import './styles/HomeHero.css';

function getHeroLabel() {
  const books = getBooks();
  const sessions = getReadingSessions();
  const hasAnyData = books.length > 0 || sessions.length > 0;

  if (!hasAnyData) {
    return 'はじめの一冊を登録してみよう';
  }

  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'おはよう';
  if (hour >= 12 && hour < 18) return 'こんにちは';
  return 'こんばんは';
}

function HomeHero() {
  const heroLabel = useMemo(() => getHeroLabel(), []);

  return (
    <header className="home-hero">
      <div className="home-hero-inner">
        <div className="home-hero-inner-bg" aria-hidden="true" />
        <div className="home-hero-inner-content">
        <div className="home-hero-copy">
          <p className="home-hero-label">{heroLabel}</p>
          <h1 className="home-hero-title">
            <span className="home-hero-title-line">毎日の読書を、</span>
            <span className="home-hero-title-line">美しく記録しよう。</span>
          </h1>
          <p className="home-hero-text">
            Reading Record は、読書時間や読んだ本、積読本をやさしい UI でまとめて管理できるシンプルな読書ログアプリです。
            数字だけでなく、その日の気分も一緒に残していけます。
          </p>
          <div className="home-hero-actions" aria-label="メイン機能">
            <Link
              to="/reading"
              className="home-hero-btn home-hero-btn--primary"
              title="タイマーで読書時間を計測・記録する"
            >
              <i className="fa-solid fa-book-open-reader" aria-hidden />
              <span>今すぐ読み始める</span>
            </Link>
            <Link
              to="/library"
              className="home-hero-btn home-hero-btn--ghost"
              title="読んだ本・読みたい本を管理する"
            >
              <i className="fa-solid fa-warehouse" aria-hidden />
              <span>本棚をひらく</span>
            </Link>
          </div>
          <p className="home-hero-meta">
            1日数分からでも OK。小さな記録が、あとで振り返ると大きな物語になります。
          </p>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-hero-photo-frame">
            <div className="home-hero-photo" />
          </div>
          <p className="home-hero-visual-caption">
            読んだ日も、読めなかった日も。すべてのページを、ここに。
          </p>
        </div>
        </div>
      </div>
    </header>
  );
}

export default HomeHero;
