import { useState, useCallback, useRef } from 'react';
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
  const [remainingTime, setRemainingTime] = useState(null);
  const initialRemainingRef = useRef(null);

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
          setRemainingTime(null);
          return 1;
        }
        setWorkPhase(true);
        return next;
      });
    }
  }, [isWorkPhase, rounds]);

  const handleUpdate = useCallback((rt) => {
    setRemainingTime(rt);
    if (initialRemainingRef.current != null) {
      initialRemainingRef.current = null;
    }
  }, []);

  const handleStart = () => {
    if (remainingTime != null && remainingTime > 0) {
      initialRemainingRef.current = remainingTime;
      setPlaying(true);
    } else {
      setCurrentRound(1);
      setWorkPhase(true);
      setRemainingTime(null);
      setPlaying(true);
    }
  };

  const handleStop = () => {
    setPlaying(false);
  };

  const handleReset = () => {
    setPlaying(false);
    setCurrentRound(1);
    setWorkPhase(true);
    setRemainingTime(null);
    initialRemainingRef.current = null;
  };

  const isPaused = !isPlaying && remainingTime != null;
  const showRunningOrPaused = isPlaying || isPaused;
  const initialRemaining = initialRemainingRef.current ?? (isPaused ? remainingTime : undefined);

  const timerCircle = !showRunningOrPaused ? (
    <CountdownCircleTimer
      key="pomodoro-initial"
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
      key={`pomodoro-${currentRound}-${isWorkPhase}-${isPlaying}`}
      isPlaying={isPlaying}
      duration={duration}
      initialRemainingTime={isPlaying ? initialRemaining : remainingTime}
      onComplete={handleComplete}
      onUpdate={isPlaying ? handleUpdate : undefined}
      size={220}
      strokeWidth={10}
      strokeLinecap="round"
      trailColor="var(--pomodoro-trail)"
      colors={isWorkPhase ? ['#6366f1', '#818cf8'] : ['#22c55e', '#4ade80']}
      colorsTime={[duration, 0]}
    >
      {({ remainingTime: rt }) => formatTime(rt)}
    </CountdownCircleTimer>
  );

  return (
    <section className="pomodoro card">
      <h2 className="pomodoro-title">ポモドーロ</h2>
      <div className="pomodoro-inner">
        <div className="pomodoro-main">
          <div className="pomodoro-timer-row">
            <div className="pomodoro-timer-column">
              <div className="pomodoro-timer-wrapper">
                {timerCircle}
              </div>
              <div className="pomodoro-actions">
                {!isPlaying ? (
                  <button type="button" className="pomodoro-btn start" onClick={handleStart}>
                    開始
                  </button>
                ) : (
                  <button type="button" className="pomodoro-btn stop" onClick={handleStop}>
                    停止
                  </button>
                )}
                {showRunningOrPaused && (
                  <button type="button" className="pomodoro-btn reset" onClick={handleReset}>
                    リセット
                  </button>
                )}
              </div>
            </div>
            {showRunningOrPaused && (
              <div className="pomodoro-status-wrap">
                <div className="pomodoro-round-bars" aria-label={`${currentRound} / ${rounds} 回目 · ${isWorkPhase ? '作業' : '休憩'}`}>
                  {Array.from({ length: rounds }, (_, i) => {
                    const completedRounds = isWorkPhase ? currentRound - 1 : currentRound;
                    const isCompleted = i < completedRounds;
                    const isActive = i === completedRounds && isWorkPhase;
                    const isNext = i === completedRounds && !isWorkPhase;
                    return (
                      <div
                        key={i}
                        className={`pomodoro-round-bar ${isCompleted ? 'pomodoro-round-bar--completed' : ''} ${isActive ? 'pomodoro-round-bar--active' : ''} ${isNext ? 'pomodoro-round-bar--next' : ''}`}
                      />
                    );
                  })}
                </div>
                <span className="pomodoro-phase-label">{isWorkPhase ? '作業' : '休憩'}</span>
              </div>
            )}
          </div>
        </div>
        {!showRunningOrPaused && (
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
