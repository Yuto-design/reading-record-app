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
              className="home-report"
              role="region"
              aria-label="読書レポート"
            >
              <section
                className="home-report__card home-report__card--overview"
                aria-label="今日の読書と統計"
              >
                <div id="home-today" className="home-report__card-content">
                  <HomeOverview />
                </div>
              </section>
              <section
                className="home-report__card home-report__card--chart"
                aria-label="今週の読書"
              >
                <div id="home-weekly-chart" className="home-report__card-content">
                  <WeeklyReadingChart compact theme="light" fullHeight />
                </div>
              </section>
              <section
                className="home-report__card home-report__card--books"
                aria-label="最近追加した本"
              >
                <div id="home-recent-books" className="home-report__card-content">
                  <HomeRecentBooks />
                </div>
              </section>
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
}

export default Home;
