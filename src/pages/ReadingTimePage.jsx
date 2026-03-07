import { useState } from 'react';
import Timer from '../features/readingSession/Timer';
import PomodoroTimer from '../features/readingSession/PomodoroTimer';
import ReadingCalendar from '../features/readingSession/ReadingCalendar';
import './styles/PageCommon.css';
import './styles/ReadingTimePage.css';

function ReadingTimePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="page-wrapper reading-time-page">
      <div className="reading-time-card">
        <div className="reading-time-card-content">
          <h2 className="reading-time-card-heading">Reading Time</h2>
          <p className="reading-time-card-sub">読書時間の記録とタイマー</p>
          <div className="timer-row">
            <Timer onSessionSaved={() => setRefreshKey((k) => k + 1)} />
            <PomodoroTimer />
          </div>
          <ReadingCalendar
            key={`cal-${refreshKey}`}
            onSessionsChange={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default ReadingTimePage;
