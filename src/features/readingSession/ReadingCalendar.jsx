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
import {
  getReadingSessions,
  saveReadingSession,
  updateReadingSession,
  deleteReadingSession,
} from '../../utils/storage';
import './styles/ReadingCalendar.css';

function formatMinutes(m) {
  if (m === 0) return '';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h${rest}m` : `${h}h`;
}

function DayDetailModal({ dateStr, onClose, onSessionsChange }) {
  const sessions = getReadingSessions().filter((s) => s.date === dateStr);
  const [editingId, setEditingId] = useState(null);
  const [editMinutes, setEditMinutes] = useState('');
  const [addMinutes, setAddMinutes] = useState('');

  const handleSaveEdit = (session) => {
    const minutes = parseInt(editMinutes, 10);
    if (Number.isNaN(minutes) || minutes < 1) return;
    updateReadingSession({ ...session, minutes });
    setEditingId(null);
    setEditMinutes('');
    onSessionsChange?.();
  };

  const handleDelete = (id) => {
    if (window.confirm('この記録を削除しますか？')) {
      deleteReadingSession(id);
      setEditingId(null);
      onSessionsChange?.();
    }
  };

  const handleAdd = () => {
    const minutes = parseInt(addMinutes, 10);
    if (Number.isNaN(minutes) || minutes < 1) return;
    saveReadingSession({ date: dateStr, minutes });
    setAddMinutes('');
    onSessionsChange?.();
  };

  const startEdit = (session) => {
    setEditingId(session.id);
    setEditMinutes(String(session.minutes));
  };

  const displayDate = dateStr
    ? format(new Date(dateStr + 'T12:00:00'), 'yyyy年M月d日', { locale: ja })
    : '';

  return (
    <div className="reading-calendar-modal-backdrop" onClick={onClose}>
      <div
        className="reading-calendar-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reading-calendar-modal-header">
          <h3 className="reading-calendar-modal-title">{displayDate} の記録</h3>
          <button
            type="button"
            className="reading-calendar-modal-close"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="reading-calendar-modal-body">
          {sessions.length === 0 && !addMinutes ? (
            <p className="reading-calendar-modal-empty">この日の記録はありません。</p>
          ) : (
            <ul className="reading-calendar-session-list">
              {sessions.map((s) => (
                <li key={s.id} className="reading-calendar-session-item">
                  {editingId === s.id ? (
                    <div className="reading-calendar-session-edit">
                      <input
                        type="number"
                        min="1"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(e.target.value)}
                        className="reading-calendar-session-input"
                      />
                      <span>分</span>
                      <button
                        type="button"
                        className="reading-calendar-session-btn save"
                        onClick={() => handleSaveEdit(s)}
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        className="reading-calendar-session-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditMinutes('');
                        }}
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="reading-calendar-session-minutes">
                        {formatMinutes(s.minutes)}
                      </span>
                      <div className="reading-calendar-session-actions">
                        <button
                          type="button"
                          className="reading-calendar-session-btn"
                          onClick={() => startEdit(s)}
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          className="reading-calendar-session-btn delete"
                          onClick={() => handleDelete(s.id)}
                        >
                          削除
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="reading-calendar-modal-add">
            <input
              type="number"
              min="1"
              placeholder="分数"
              value={addMinutes}
              onChange={(e) => setAddMinutes(e.target.value)}
              className="reading-calendar-session-input"
            />
            <span>分を追加</span>
            <button
              type="button"
              className="reading-calendar-session-btn save"
              onClick={handleAdd}
              disabled={!addMinutes || parseInt(addMinutes, 10) < 1}
            >
              記録を追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingCalendar({ onSessionsChange }) {
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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
            <button
              type="button"
              key={key}
              className={`reading-calendar-day ${!inMonth ? 'other-month' : ''}`}
              onClick={() => setSelectedDate(key)}
            >
              <span className="reading-calendar-day-num">{format(d, 'd')}</span>
              {minutes > 0 && (
                <span className="reading-calendar-day-minutes">
                  {formatMinutes(minutes)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <DayDetailModal
          dateStr={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSessionsChange={onSessionsChange}
        />
      )}
    </section>
  );
}

export default ReadingCalendar;
