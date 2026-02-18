import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions, getBooks } from '../utils/storage';
import './Home.css';

function formatMinutes(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}分`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m ? `${h}時間${m}分` : `${h}時間`;
}

function Home() {
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

  return (
    <div className="home">
      <header className="home-hero">
        <h1 className="home-title">Reading Record</h1>
        <p className="home-subtitle">読書の記録を残して、習慣を育てよう</p>
      </header>

      <section className="home-stats">
        <div className="home-stat-card">
          <span className="home-stat-value">{formatMinutes(stats.totalMinutes)}</span>
          <span className="home-stat-label">総読書時間</span>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-value">{formatMinutes(stats.weekMinutes)}</span>
          <span className="home-stat-label">今週</span>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-value">{formatMinutes(stats.monthMinutes)}</span>
          <span className="home-stat-label">
            {format(new Date(), 'M月', { locale: ja })}
          </span>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-value">{stats.bookCount}</span>
          <span className="home-stat-label">登録書籍</span>
        </div>
      </section>

      <section className="home-actions">
        <Link to="/reading" className="home-action-card">
          <span className="home-action-icon" aria-hidden>📖</span>
          <h2 className="home-action-title">Reading Time</h2>
          <p className="home-action-desc">タイマーで読書時間を計測・記録する</p>
        </Link>
        <Link to="/library" className="home-action-card">
          <span className="home-action-icon" aria-hidden>📚</span>
          <h2 className="home-action-title">My Library</h2>
          <p className="home-action-desc">読んだ本・読みたい本を管理する</p>
        </Link>
      </section>
    </div>
  );
}

export default Home;
