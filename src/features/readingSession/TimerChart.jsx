import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TARGET_SECONDS = 3600;

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  }
  return [m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

function TimerChart({ elapsed = 0, running = false }) {
  const percentage = Math.min(100, (elapsed / TARGET_SECONDS) * 100);
  const displayText = elapsed > 0 ? formatElapsed(elapsed) : '0:00';

  return (
    <div className={`timer-chart ${running ? 'timer-chart--running' : ''}`}>
      <CircularProgressbar
        value={percentage}
        text={displayText}
        strokeWidth={8}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'round',
          textSize: '1.25rem',
          fontWeight: 600,
          pathColor: running ? 'var(--timer-progress)' : 'var(--timer-progress-idle)',
          textColor: 'var(--timer-text)',
          trailColor: 'var(--timer-trail)',
        })}
      />
    </div>
  );
}

export default TimerChart;