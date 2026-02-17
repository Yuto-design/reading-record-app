import { useState } from 'react';
import Timer from '../components/Timer';
import ReadingCalendar from '../components/ReadingCalendar';
import WeeklyReadingChart from '../components/WeeklyReadingChart';

function ReadingTimePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="reading-time-page">
      <Timer onSessionSaved={() => setRefreshKey((k) => k + 1)} />
      <WeeklyReadingChart key={`chart-${refreshKey}`} />
      <ReadingCalendar key={`cal-${refreshKey}`} />
    </div>
  );
}

export default ReadingTimePage;
