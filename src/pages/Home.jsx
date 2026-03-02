import { HomeHero, HomeOverview, HomeRecentBooks } from '../features/home';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import './styles/Home.css';

function Home() {
  return (
    <div className="home">
      <main className="home-main">
        <HomeHero />
        <div id="home-today" aria-label="今日の読書と統計">
          <HomeOverview />
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
