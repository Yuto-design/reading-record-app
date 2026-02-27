import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { getReadingSessions, getBooks } from '../../utils/storage';
import { formatMinutes } from '../../utils/changeTime';
import './styles/HomeStars.css';

const DAILY_GOAL_MINUTES = 30;
const TOTAL_GOAL_MINUTES = DAILY_GOAL_MINUTES * 365;
const BOOK_GOAL_COUNT = 50;

function HomeStats() {
  const sessions = getReadingSessions();
  const books = getBooks();

  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    let weekMinutes = 0;
    let monthMinutes = 0;
    sessions.forEach((s) => {
      const d = s.date;
      if (d >= format(weekStart, 'yyyy-MM-dd') && d <= format(weekEnd, 'yyyy-MM-dd')) {
        weekMinutes += s.minutes;
      }
      if (d >= format(monthStart, 'yyyy-MM-dd') && d <= format(monthEnd, 'yyyy-MM-dd')) {
        monthMinutes += s.minutes;
      }
    });

    return {
      totalMinutes,
      weekMinutes,
      monthMinutes,
      bookCount: books.length,
    };
  }, [sessions, books]);

  const totalProgress = TOTAL_GOAL_MINUTES
    ? Math.min(stats.totalMinutes / TOTAL_GOAL_MINUTES, 1)
    : 0;
  const bookProgress = BOOK_GOAL_COUNT
    ? Math.min(stats.bookCount / BOOK_GOAL_COUNT, 1)
    : 0;

  const totalProgressDeg = totalProgress * 360;
  const bookProgressDeg = bookProgress * 360;

  return (
    <section className="home-stats">
      <div className="home-stat-card">
        <div
          className="home-stat-circle"
          style={{ '--progress': `${totalProgressDeg}deg` }}
        >
          <span className="home-stat-circle-text">{Math.round(totalProgress * 100)}%</span>
        </div>
        <span className="home-stat-value">総 {formatMinutes(stats.totalMinutes)}</span>
        <span className="home-stat-label">読書時間</span>
      </div>
      <div className="home-stat-card">
        <div
          className="home-stat-circle"
          style={{ '--progress': `${bookProgressDeg}deg` }}
        >
          <span className="home-stat-circle-text">{stats.bookCount}冊</span>
        </div>
        <span className="home-stat-value">登録書籍</span>
        <span className="home-stat-label">目標 {BOOK_GOAL_COUNT}冊</span>
      </div>
    </section>
  );
}

export default HomeStats;
