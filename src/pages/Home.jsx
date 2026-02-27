import { HomeHero, HomeTodayHighlight, HomeStats, HomeRecentBooks, HomeSidebar } from '../features/home';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <main className="home-main">
        <HomeSidebar />
        <HomeHero />
        <div className="home-top-row">
          <div id="home-today" aria-label="今日の読書">
            <HomeTodayHighlight />
          </div>
        </div>
        <div id="home-stats" aria-label="統計">
          <HomeStats />
        </div>
        <div id="home-weekly-chart" aria-label="今週の読書">
          <WeeklyReadingChart compact />
        </div>
        <div id="home-recent-books" aria-label="最近追加した本">
          <HomeRecentBooks />
        </div>
      </main>
    </div>
  );
}

export default Home;
