import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import TimerChart from './TimerChart';
import { saveReadingSession } from '../../utils/storage';
import './styles/Timer.css';

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
        </div>
      </div>
    </section>
  );
}

export default Timer;
