import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import TimerChart from './TimerChart';
import { saveReadingSession, getBooks } from '../../utils/storage';
import './styles/Timer.css';

function Timer({ onSessionSaved }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState('');
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const bookOptions = useMemo(() => {
    const books = getBooks();
    return books.filter((b) => b.status === 'reading' || b.status === 'read');
  }, []);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, elapsed]);

  const handleStart = () => setRunning(true);
  const handleStop = () => {
    setRunning(false);
    if (elapsed >= 1) {
      const minutes = Math.ceil(elapsed / 60);
      const date = format(new Date(), 'yyyy-MM-dd');
      saveReadingSession({
        date,
        minutes,
        ...(selectedBookId && { bookId: selectedBookId }),
      });
      onSessionSaved?.();
      setElapsed(0);
    }
  };

  return (
    <section className="timer card">
      <h2 className="timer-title">読書タイマー</h2>
      <div className="timer-inner">
        <div className="timer-container">
          <TimerChart elapsed={elapsed} running={running} />
          <div className="timer-actions">
            {running ? (
              <button type="button" className="timer-btn stop" onClick={handleStop}>
                停止して記録
              </button>
            ) : (
              <button type="button" className="timer-btn start" onClick={handleStart}>
                開始
              </button>
            )}
          </div>
          <div className="timer-book-select-wrap">
            <label htmlFor="timer-book-select" className="timer-book-select-label">
              読んだ本（任意）
            </label>
            <select
              id="timer-book-select"
              className="timer-book-select"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              disabled={running}
            >
              <option value="">選択しない</option>
              {bookOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title || '（タイトルなし）'}
                  {b.author ? ` - ${b.author}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timer;
