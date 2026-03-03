import { HomeHero, HomeOverview, HomeRecentBooks } from '../features/home';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import RevealOnScroll from '../components/RevealOnScroll';
import './styles/Home.css';

function Home() {
  return (
    <div className="home">
      <main className="home-main">
        <HomeHero />

        <div className="home-content">
          <p className="home-content-label" aria-hidden="true">
            Reading
          </p>
          <RevealOnScroll>
            <div
              className="home-book"
              role="region"
              aria-label="読書レポート"
            >
              <div className="home-book__inner">
                <div className="home-book__pages-wrap">
                  <div className="home-book__page home-book__page--1" aria-label="1ページ目 今日の読書と統計">
                    <div id="home-today" className="home-book__page-content">
                      <HomeOverview />
                    </div>
                  </div>
                  <div className="home-book__page home-book__page--2" aria-label="2ページ目 今週の読書">
                    <div id="home-weekly-chart" className="home-book__page-content">
                      <WeeklyReadingChart compact theme="light" fullHeight />
                    </div>
                  </div>
                  <div className="home-book__page home-book__page--3" aria-label="3ページ目 最近追加した本">
                    <div id="home-recent-books" className="home-book__page-content">
                      <HomeRecentBooks />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
}

export default Home;
