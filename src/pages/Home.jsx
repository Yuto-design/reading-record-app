import { Link } from 'react-router-dom';
import { HomeHero, HomeHeroFeatures, HomeOverview, HomeRecentBooks } from '../features/home';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import RevealOnScroll from '../components/RevealOnScroll';
import './styles/PageCommon.css';
import './styles/Home.css';

function Home() {
  return (
    <div className="home">
      <main className="home-main">
        <div className="home-card">
          <h2 className="home-card-heading">Home</h2>
          <p className="home-card-sub">今日の読書とアプリの概要</p>
          <div className="home-card-content">
            <HomeHero />
            <HomeHeroFeatures />

            <div className="home-content">
          <RevealOnScroll>
            <div
              className="home-report-layout"
              role="region"
              aria-label="読書レポート"
            >
              <div className="home-report__right">
                <div className="home-report__header">
                  <h2 className="home-report__heading">REPORT.</h2>
                  <p className="home-report__sub">
                    <span className="home-report__sub-dots" aria-hidden="true">●●</span>
                    今日の読書と統計をまとめています。
                  </p>
                </div>
                <div className="home-report home-report--grid">
                  <section
                    className="home-report__card home-report__card--overview home-report__card--pos-1"
                aria-label="今日の読書と統計"
              >
                <div className="home-report__card-visual">
                  <div id="home-today" className="home-report__card-content">
                    <HomeOverview />
                  </div>
                </div>
                <div className="home-report__card-body">
                  <h2 className="home-report__card-title">今日の読書と統計</h2>
                  <p className="home-report__card-desc">今日・今週・今月の読書時間と目標達成率をひと目で確認。</p>
                  <Link
                    to="/reading"
                    className="home-report__card-read-more"
                    title="読書タイマーを開く"
                  >
                    <span className="home-report__card-read-more-dot" aria-hidden="true">●</span>
                    READ MORE
                  </Link>
                </div>
              </section>
              <section
                className="home-report__card home-report__card--chart home-report__card--pos-2"
                aria-label="今週の読書"
              >
                <div className="home-report__card-visual">
                  <div id="home-weekly-chart" className="home-report__card-content">
                    <WeeklyReadingChart compact theme="light" fullHeight />
                  </div>
                </div>
                <div className="home-report__card-body">
                  <h2 className="home-report__card-title">今週の読書</h2>
                  <p className="home-report__card-desc">直近7日間の読書時間をグラフで振り返る。</p>
                  <Link
                    to="/reading"
                    className="home-report__card-read-more"
                    title="読書タイマーを開く"
                  >
                    <span className="home-report__card-read-more-dot" aria-hidden="true">●</span>
                    READ MORE
                  </Link>
                </div>
              </section>
              <section
                className="home-report__card home-report__card--books home-report__card--pos-3"
                aria-label="最近追加した本"
              >
                <div className="home-report__card-visual">
                  <div id="home-recent-books" className="home-report__card-content">
                    <HomeRecentBooks />
                  </div>
                </div>
                <div className="home-report__card-body">
                  <h2 className="home-report__card-title">最近追加した本</h2>
                  <p className="home-report__card-desc">読んだ本・読みたい本を本棚で管理。</p>
                  <Link
                    to="/library"
                    className="home-report__card-read-more"
                    title="本棚を見る"
                  >
                    <span className="home-report__card-read-more-dot" aria-hidden="true">●</span>
                    READ MORE
                  </Link>
                </div>
              </section>
                </div>
              </div>
            </div>
          </RevealOnScroll>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
