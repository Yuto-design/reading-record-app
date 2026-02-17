import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { saveReadingSession } from '../utils/storage';
import './Timer.css';

function Timer({ onSessionSaved }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

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
      saveReadingSession({ date, minutes });
      onSessionSaved?.();
      setElapsed(0);
    }
  };

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const display = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');

  return (
    <section className="timer card">
      <h2 className="timer-title">読書タイマー</h2>
      <div className="timer-display">{display}</div>
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
    </section>
  );
}

export default Timer;
