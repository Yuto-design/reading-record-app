import { useState } from 'react';
import { HomeHero, HomeOverview, HomeRecentBooks } from '../features/home';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import RevealOnScroll from '../components/RevealOnScroll';
import './styles/Home.css';

function Home() {
  const [currentPage, setCurrentPage] = useState(1);

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
              <div className="home-book__cover" aria-hidden="true">
                <span className="home-book__cover-title">Reading</span>
              </div>
              <div className="home-book__spine" aria-hidden="true" />
              <div className="home-book__inner">
                <div className="home-book__pages-wrap">
                  <div
                    className={`home-book__page home-book__page--1 ${currentPage === 1 ? 'home-book__page--active' : ''}`}
                    aria-hidden={currentPage !== 1}
                    aria-label="1ページ目 今日の読書と統計"
                  >
                    <div id="home-today" className="home-book__page-content">
                      <HomeOverview />
                    </div>
                  </div>
                  <div
                    className={`home-book__page home-book__page--2 ${currentPage === 2 ? 'home-book__page--active' : ''}`}
                    aria-hidden={currentPage !== 2}
                    aria-label="2ページ目 今週の読書"
                  >
                    <div id="home-weekly-chart" className="home-book__page-content">
                      <WeeklyReadingChart compact theme="light" fullHeight />
                    </div>
                  </div>
                  <div
                    className={`home-book__page home-book__page--3 ${currentPage === 3 ? 'home-book__page--active' : ''}`}
                    aria-hidden={currentPage !== 3}
                    aria-label="3ページ目 最近追加した本"
                  >
                    <div id="home-recent-books" className="home-book__page-content">
                      <HomeRecentBooks />
                    </div>
                  </div>
                </div>
                <nav
                  className="home-book__nav"
                  aria-label="ページ"
                >
                  <div className="home-book__pagination" role="tablist" aria-label="ページ">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        role="tab"
                        aria-selected={currentPage === num}
                        aria-label={`${num}ページ目`}
                        className={`home-book__page-dot ${currentPage === num ? 'home-book__page-dot--active' : ''}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
}

export default Home;
