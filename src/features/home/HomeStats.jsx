import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions, getBooks } from '../../utils/storage';
import { formatMinutes } from './utils';
import './styles/HomeStars.css';

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

  return (
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
  );
}

export default HomeStats;
