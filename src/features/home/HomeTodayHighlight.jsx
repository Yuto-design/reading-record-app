import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getReadingSessions } from '../../utils/storage';
import { formatMinutes } from '../../utils/changeTime';
import './styles/HomeTodayHighlight.css';

function HomeTodayHighlight() {
  const sessions = getReadingSessions();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const todayMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + s.minutes, 0);
  }, [sessions, todayStr]);

  const hasRecord = todayMinutes > 0;

  return (
    <section className="home-today-highlight">
      <div className="home-today-highlight-inner">
        <span className="home-today-label">今日</span>
        <span className="home-today-value">{formatMinutes(todayMinutes)}</span>
      </div>
      {!hasRecord && (
        <Link to="/reading" className="home-today-cta">
          まだ記録なし → タイマーで計測
        </Link>
      )}
    </section>
  );
}

export default HomeTodayHighlight;
