import { useState } from 'react';
import Timer from '../features/readingSession/Timer';
import PomodoroTimer from '../features/readingSession/PomodoroTimer';
import ReadingCalendar from '../features/readingSession/ReadingCalendar';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';
import './ReadingTimePage.css';

function ReadingTimePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="reading-time-page">
      <div className="timer-row">
        <Timer onSessionSaved={() => setRefreshKey((k) => k + 1)} />
        <PomodoroTimer />
      </div>
      <WeeklyReadingChart key={`chart-${refreshKey}`} />
      <ReadingCalendar
        key={`cal-${refreshKey}`}
        onSessionsChange={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

export default ReadingTimePage;
