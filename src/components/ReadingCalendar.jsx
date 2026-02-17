import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions } from '../utils/storage';
import './ReadingCalendar.css';

function ReadingCalendar() {
  const [current, setCurrent] = useState(new Date());
  const sessions = getReadingSessions();

  const minutesByDate = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      const d = s.date;
      map[d] = (map[d] || 0) + s.minutes;
    });
    return map;
  }, [sessions]);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const formatMinutes = (m) => {
    if (m === 0) return '';
    if (m < 60) return `${m}分`;
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return rest ? `${h}h${rest}分` : `${h}時間`;
  };

  return (
    <section className="reading-calendar card">
      <div className="reading-calendar-header">
        <h2 className="reading-calendar-title">カレンダー</h2>
        <div className="reading-calendar-nav">
          <button
            type="button"
            className="reading-calendar-nav-btn"
            onClick={() => setCurrent(subMonths(current, 1))}
          >
            前月
          </button>
          <span className="reading-calendar-month">
            {format(current, 'yyyy年M月', { locale: ja })}
          </span>
          <button
            type="button"
            className="reading-calendar-nav-btn"
            onClick={() => setCurrent(addMonths(current, 1))}
          >
            次月
          </button>
        </div>
      </div>
      <div className="reading-calendar-grid">
        {['日', '月', '火', '水', '木', '金', '土'].map((w) => (
          <div key={w} className="reading-calendar-weekday">
            {w}
          </div>
        ))}
        {weeks.flat().map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const minutes = minutesByDate[key] || 0;
          const inMonth = isSameMonth(d, current);
          return (
            <div
              key={key}
              className={`reading-calendar-day ${!inMonth ? 'other-month' : ''}`}
            >
              <span className="reading-calendar-day-num">{format(d, 'd')}</span>
              {minutes > 0 && (
                <span className="reading-calendar-day-minutes">
                  {formatMinutes(minutes)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ReadingCalendar;
