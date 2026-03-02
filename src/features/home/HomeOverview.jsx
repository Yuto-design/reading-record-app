import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { getReadingSessions, getBooks } from '../../utils/storage';
import { formatMinutes } from '../../utils/changeTime';
import './styles/HomeOverview.css';

const DAILY_GOAL_MINUTES = 30;
const WEEKLY_GOAL_MINUTES = DAILY_GOAL_MINUTES * 7;
const MONTHLY_GOAL_MINUTES = DAILY_GOAL_MINUTES * 30;
const BOOK_GOAL_COUNT = 50;
const TOTAL_GOAL_MINUTES = DAILY_GOAL_MINUTES * 365;

function HomeOverview() {
  const sessions = getReadingSessions();
  const books = getBooks();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    let todayMinutes = 0;
    let weekMinutes = 0;
    let monthMinutes = 0;

    sessions.forEach((s) => {
      const d = s.date;
      if (d === todayStr) {
        todayMinutes += s.minutes;
      }
      if (d >= format(weekStart, 'yyyy-MM-dd') && d <= format(weekEnd, 'yyyy-MM-dd')) {
        weekMinutes += s.minutes;
      }
      if (d >= format(monthStart, 'yyyy-MM-dd') && d <= format(monthEnd, 'yyyy-MM-dd')) {
        monthMinutes += s.minutes;
      }
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);

    return {
      todayMinutes,
      weekMinutes,
      monthMinutes,
      totalMinutes,
      bookCount: books.length,
    };
  }, [sessions, books, todayStr]);

  const todayProgress = DAILY_GOAL_MINUTES
    ? Math.min(stats.todayMinutes / DAILY_GOAL_MINUTES, 1)
    : 0;
  const weekProgress = WEEKLY_GOAL_MINUTES
    ? Math.min(stats.weekMinutes / WEEKLY_GOAL_MINUTES, 1)
    : 0;
  const monthProgress = MONTHLY_GOAL_MINUTES
    ? Math.min(stats.monthMinutes / MONTHLY_GOAL_MINUTES, 1)
    : 0;

  const todayProgressDeg = todayProgress * 360;
  const weekProgressDeg = weekProgress * 360;
  const monthProgressDeg = monthProgress * 360;

  const totalProgress = TOTAL_GOAL_MINUTES
    ? Math.min(stats.totalMinutes / TOTAL_GOAL_MINUTES, 1)
    : 0;
  const bookProgress = BOOK_GOAL_COUNT
    ? Math.min(stats.bookCount / BOOK_GOAL_COUNT, 1)
    : 0;

  const totalProgressDeg = totalProgress * 360;
  const bookProgressDeg = bookProgress * 360;

  return (
    <>
      <h2 className="home-today-overview-title">今日の読書と統計</h2>
      <section className="home-today-overview">
        <div className="home-today-highlight home-today-overview-main">
          <div className="home-today-highlight-inner">
            <div className="home-today-circle-block">
              <div
                className="home-today-clock"
                style={{ '--progress': `${todayProgressDeg}deg` }}
              >
                <div className="home-today-clock-inner">
                  <span className="home-today-value">
                    {formatMinutes(stats.todayMinutes)}
                  </span>
                  <span className="home-today-percent">
                    {Math.round(todayProgress * 100)}%
                  </span>
                </div>
              </div>
              <span className="home-today-label">今日</span>
              <span className="home-today-goal">
                目標 {formatMinutes(DAILY_GOAL_MINUTES)}
              </span>
            </div>
            <div className="home-today-circle-block">
              <div
                className="home-today-clock"
                style={{ '--progress': `${weekProgressDeg}deg` }}
              >
                <div className="home-today-clock-inner">
                  <span className="home-today-value">
                    {formatMinutes(stats.weekMinutes)}
                  </span>
                  <span className="home-today-percent">
                    {Math.round(weekProgress * 100)}%
                  </span>
                </div>
              </div>
              <span className="home-today-label">今週</span>
              <span className="home-today-goal">
                目標 {formatMinutes(WEEKLY_GOAL_MINUTES)}
              </span>
            </div>
            <div className="home-today-circle-block">
              <div
                className="home-today-clock"
                style={{ '--progress': `${monthProgressDeg}deg` }}
              >
                <div className="home-today-clock-inner">
                  <span className="home-today-value">
                    {formatMinutes(stats.monthMinutes)}
                  </span>
                  <span className="home-today-percent">
                    {Math.round(monthProgress * 100)}%
                  </span>
                </div>
              </div>
              <span className="home-today-label">今月</span>
              <span className="home-today-goal">
                目標 {formatMinutes(MONTHLY_GOAL_MINUTES)}
              </span>
            </div>
            <div className="home-today-circle-block">
              <div
                className="home-today-clock"
                style={{ '--progress': `${totalProgressDeg}deg` }}
              >
                <span className="home-stat-circle-text">
                  {Math.round(totalProgress * 100)}%
                </span>
              </div>
              <span className="home-today-label">
                総 {formatMinutes(stats.totalMinutes)}
              </span>
              <span className="home-today-goal">読書時間</span>
            </div>
            <div className="home-today-circle-block">
              <div
                className="home-today-clock"
                style={{ '--progress': `${bookProgressDeg}deg` }}
              >
                <span className="home-stat-circle-text">{stats.bookCount}冊</span>
              </div>
              <span className="home-today-label">登録書籍</span>
              <span className="home-today-goal">目標 {BOOK_GOAL_COUNT}冊</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeOverview;

