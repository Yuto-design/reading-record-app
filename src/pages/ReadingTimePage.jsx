import { useState } from 'react';
import Timer from '../features/readingSession/Timer';
import ReadingCalendar from '../features/readingSession/ReadingCalendar';
import WeeklyReadingChart from '../features/readingSession/WeeklyReadingChart';

function ReadingTimePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="reading-time-page">
      <Timer onSessionSaved={() => setRefreshKey((k) => k + 1)} />
      <WeeklyReadingChart key={`chart-${refreshKey}`} />
      <ReadingCalendar
        key={`cal-${refreshKey}`}
        onSessionsChange={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

export default ReadingTimePage;
