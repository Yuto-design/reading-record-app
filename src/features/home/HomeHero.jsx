import { Link } from 'react-router-dom';
import './styles/HomeHero.css';

function HomeHero() {
  return (
    <header className="home-hero">
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <p className="home-hero-label">For your reading life</p>
          <h1 className="home-hero-title">
            毎日の読書を、
            <span>美しく記録</span>
            しよう。
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
      <div className="home-hero-features" aria-label="アプリの主な機能">
        <div className="home-hero-features-inner">
          <div className="home-hero-feature">
            <div className="home-hero-feature-icon home-hero-feature-icon--timer">
              <i className="fa-regular fa-clock" aria-hidden />
            </div>
            <div className="home-hero-feature-body">
              <h2 className="home-hero-feature-title">読書タイマーで記録</h2>
              <p className="home-hero-feature-text">
                タイマーをスタート・ストップするだけで、その日の読書時間が自動でまとまります。
              </p>
            </div>
          </div>
          <div className="home-hero-feature">
            <div className="home-hero-feature-icon home-hero-feature-icon--shelf">
              <i className="fa-solid fa-book-open" aria-hidden />
            </div>
            <div className="home-hero-feature-body">
              <h2 className="home-hero-feature-title">本棚で本を記録</h2>
              <p className="home-hero-feature-text">
                読んだ本・読みたい本・積読本を、シンプルな本棚 UI で整理しておけます。
              </p>
            </div>
          </div>
          <div className="home-hero-feature">
            <div className="home-hero-feature-icon home-hero-feature-icon--memo">
              <i className="fa-regular fa-pen-to-square" aria-hidden />
            </div>
            <div className="home-hero-feature-body">
              <h2 className="home-hero-feature-title">その日のメモも一緒に</h2>
              <p className="home-hero-feature-text">
                印象に残った一文や、その日の気分を一言メモとして、本と一緒に残せます。
              </p>
            </div>
          </div>
          <div className="home-hero-feature">
            <div className="home-hero-feature-icon home-hero-feature-icon--graph">
              <i className="fa-solid fa-chart-line" aria-hidden />
            </div>
            <div className="home-hero-feature-body">
              <h2 className="home-hero-feature-title">グラフで習慣を可視化</h2>
              <p className="home-hero-feature-text">
                月ごとの読書量や目標達成までのペースを、わかりやすいグラフで振り返れます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomeHero;
