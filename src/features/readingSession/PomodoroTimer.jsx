import { useState, useCallback } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './styles/PomodoroTimer.css';

const DEFAULT_WORK_MIN = 25;
const DEFAULT_BREAK_MIN = 5;
const DEFAULT_ROUNDS = 4;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(DEFAULT_WORK_MIN);
  const [breakMin, setBreakMin] = useState(DEFAULT_BREAK_MIN);
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [isPlaying, setPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setWorkPhase] = useState(true);

  const workDuration = workMin * 60;
  const breakDuration = breakMin * 60;
  const duration = isWorkPhase ? workDuration : breakDuration;

  const handleComplete = useCallback(() => {
    if (isWorkPhase) {
      setWorkPhase(false);
    } else {
      setCurrentRound((r) => {
        const next = r + 1;
        if (next > rounds) {
          setPlaying(false);
          setWorkPhase(true);
          return 1;
        }
        setWorkPhase(true);
        return next;
      });
    }
  }, [isWorkPhase, rounds]);

  const handleStart = () => {
    setCurrentRound(1);
    setWorkPhase(true);
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    setWorkPhase(true);
    setCurrentRound(1);
  };

  const timerCircle = !isPlaying ? (
    <CountdownCircleTimer
      key={`pomodoro-${currentRound}-${isWorkPhase}`}
      isPlaying={false}
      duration={workDuration}
      size={220}
      strokeWidth={10}
      trailColor="var(--pomodoro-trail)"
      colors={['#6366f1', '#6366f1']}
    >
      {() => formatTime(workDuration)}
    </CountdownCircleTimer>
  ) : (
    <CountdownCircleTimer
      key={`pomodoro-${currentRound}-${isWorkPhase}`}
      isPlaying={isPlaying}
      duration={duration}
      onComplete={handleComplete}
      size={220}
      strokeWidth={10}
      strokeLinecap="round"
      trailColor="var(--pomodoro-trail)"
      colors={isWorkPhase ? ['#6366f1', '#818cf8'] : ['#22c55e', '#4ade80']}
      colorsTime={[duration, 0]}
    >
      {({ remainingTime }) => formatTime(remainingTime)}
    </CountdownCircleTimer>
  );

  return (
    <section className="pomodoro card">
      <h2 className="pomodoro-title">ポモドーロ</h2>
      <div className="pomodoro-inner">
        <div className="pomodoro-main">
          <div className="pomodoro-timer-wrapper">
            {timerCircle}
          </div>
          {!isPlaying ? (
            <button type="button" className="pomodoro-btn start" onClick={handleStart}>
              開始
            </button>
          ) : (
            <button type="button" className="pomodoro-btn stop" onClick={handleStop}>
              停止
            </button>
          )}
        </div>
        {isPlaying ? (
          <div className="pomodoro-status-wrap">
            <div className="pomodoro-status">
              {currentRound} / {rounds} 回目 · {isWorkPhase ? '作業' : '休憩'}
            </div>
          </div>
        ) : (
          <div className="pomodoro-settings">
            <label className="pomodoro-label">
              <span>作業（分）</span>
              <input
                type="number"
                min={1}
                max={60}
                value={workMin}
                onChange={(e) => setWorkMin(Number(e.target.value) || DEFAULT_WORK_MIN)}
                className="pomodoro-input"
              />
            </label>
            <label className="pomodoro-label">
              <span>休憩（分）</span>
              <input
                type="number"
                min={1}
                max={30}
                value={breakMin}
                onChange={(e) => setBreakMin(Number(e.target.value) || DEFAULT_BREAK_MIN)}
                className="pomodoro-input"
              />
            </label>
            <label className="pomodoro-label">
              <span>繰り返し回数</span>
              <input
                type="number"
                min={1}
                max={10}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value) || DEFAULT_ROUNDS)}
                className="pomodoro-input"
              />
            </label>
          </div>
        )}
      </div>
    </section>
  );
}

export default PomodoroTimer;
