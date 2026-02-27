import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { getReadingSessions } from '../../utils/storage';
import { formatMinutes } from '../../utils/changeTime';
import './styles/HomeTodayHighlight.css';

const DAILY_GOAL_MINUTES = 30;
const WEEKLY_GOAL_MINUTES = DAILY_GOAL_MINUTES * 7;
const MONTHLY_GOAL_MINUTES = DAILY_GOAL_MINUTES * 30;

function HomeTodayHighlight() {
  const sessions = getReadingSessions();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const { todayMinutes, weekMinutes, monthMinutes } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    sessions.forEach((s) => {
      const d = s.date;
      if (d === todayStr) {
        todayTotal += s.minutes;
      }
      if (d >= format(weekStart, 'yyyy-MM-dd') && d <= format(weekEnd, 'yyyy-MM-dd')) {
        weekTotal += s.minutes;
      }
      if (d >= format(monthStart, 'yyyy-MM-dd') && d <= format(monthEnd, 'yyyy-MM-dd')) {
        monthTotal += s.minutes;
      }
    });

    return {
      todayMinutes: todayTotal,
      weekMinutes: weekTotal,
      monthMinutes: monthTotal,
    };
  }, [sessions, todayStr]);

  const todayProgress = DAILY_GOAL_MINUTES
    ? Math.min(todayMinutes / DAILY_GOAL_MINUTES, 1)
    : 0;
  const weekProgress = WEEKLY_GOAL_MINUTES
    ? Math.min(weekMinutes / WEEKLY_GOAL_MINUTES, 1)
    : 0;
  const monthProgress = MONTHLY_GOAL_MINUTES
    ? Math.min(monthMinutes / MONTHLY_GOAL_MINUTES, 1)
    : 0;

  const todayProgressDeg = todayProgress * 360;
  const weekProgressDeg = weekProgress * 360;
  const monthProgressDeg = monthProgress * 360;

  return (
    <section className="home-today-highlight">
      <h1 className="home-today-highlight-title">読書の統計</h1>
      <div className="home-today-highlight-inner">
        <div className="home-today-circle-block">
          <div
            className="home-today-clock"
            style={{ '--progress': `${todayProgressDeg}deg` }}
          >
            <div className="home-today-clock-inner">
              <span className="home-today-value">{formatMinutes(todayMinutes)}</span>
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
              <span className="home-today-value">{formatMinutes(weekMinutes)}</span>
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
              <span className="home-today-value">{formatMinutes(monthMinutes)}</span>
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
      </div>
    </section>
  );
}

export default HomeTodayHighlight;
