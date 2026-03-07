import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  format,
  subMonths,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions, getBooks, getSettings } from '../utils/storage';
import { formatMinutes } from '../utils/changeTime';
import './styles/PageCommon.css';
import './styles/StatsPage.css';

function StatsPage() {
  const [sessions, setSessions] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setSessions(getReadingSessions());
    setBooks(getBooks());
  }, []);

  const monthlyData = useMemo(() => {
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const monthStart = startOfMonth(d);
      const monthEnd = endOfMonth(d);
      const startStr = format(monthStart, 'yyyy-MM-dd');
      const endStr = format(monthEnd, 'yyyy-MM-dd');
      let minutes = 0;
      sessions.forEach((s) => {
        if (s.date >= startStr && s.date <= endStr) minutes += s.minutes;
      });
      result.push({
        monthKey: format(d, 'yyyy-MM'),
        label: format(d, 'M月', { locale: ja }),
        yearMonth: format(d, 'yyyy年M月', { locale: ja }),
        minutes,
      });
    }
    return result;
  }, [sessions]);

  const tagStats = useMemo(() => {
    const byTag = {};
    sessions.forEach((s) => {
      if (!s.bookId) return;
      const book = books.find((b) => b.id === s.bookId);
      if (!book || !Array.isArray(book.tags)) return;
      book.tags.forEach((tag) => {
        byTag[tag] = (byTag[tag] || 0) + (s.minutes || 0);
      });
    });
    return Object.entries(byTag)
      .map(([tag, minutes]) => ({ tag, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 10);
  }, [sessions, books]);

  const authorStats = useMemo(() => {
    const byAuthor = {};
    sessions.forEach((s) => {
      if (!s.bookId) return;
      const book = books.find((b) => b.id === s.bookId);
      if (!book || !(book.author || '').trim()) return;
      const author = book.author.trim();
      byAuthor[author] = (byAuthor[author] || 0) + (s.minutes || 0);
    });
    return Object.entries(byAuthor)
      .map(([author, minutes]) => ({ author, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 10);
  }, [sessions, books]);

  const readBooks = useMemo(() => books.filter((b) => b.status === 'read'), [books]);
  const completedCount = readBooks.length;
  const avgRating = useMemo(() => {
    const withRating = readBooks.filter((b) => b.rating >= 1 && b.rating <= 5);
    if (withRating.length === 0) return null;
    const sum = withRating.reduce((a, b) => a + (b.rating || 0), 0);
    return (sum / withRating.length).toFixed(1);
  }, [readBooks]);

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.minutes || 0), 0),
    [sessions]
  );

  const avgSessionMinutes = useMemo(() => {
    if (sessions.length === 0) return null;
    return Math.round(totalMinutes / sessions.length);
  }, [sessions.length, totalMinutes]);

  const streakData = useMemo(() => {
    const dateSet = new Set(sessions.map((s) => s.date));
    const sortedDates = [...dateSet].sort();
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    let currentStreak = 0;
    if (dateSet.has(todayStr)) {
      currentStreak = 1;
      let d = todayStr;
      for (;;) {
        const prev = format(subDays(parseISO(d), 1), 'yyyy-MM-dd');
        if (!dateSet.has(prev)) break;
        currentStreak += 1;
        d = prev;
      }
    }

    let longestStreak = 0;
    if (sortedDates.length > 0) {
      let run = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = format(subDays(parseISO(sortedDates[i]), 1), 'yyyy-MM-dd');
        if (sortedDates[i - 1] === prev) {
          run += 1;
        } else {
          run = 1;
        }
        longestStreak = Math.max(longestStreak, run);
      }
      longestStreak = Math.max(longestStreak, run);
    }
    return { currentStreak, longestStreak };
  }, [sessions]);

  const weeklyTrendData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      let minutes = 0;
      sessions.forEach((s) => {
        if (s.date === dateStr) minutes += s.minutes || 0;
      });
      result.push({
        dateStr,
        label: format(d, 'M/d', { locale: ja }),
        fullLabel: format(d, 'yyyy年M月d日', { locale: ja }),
        minutes,
      });
    }
    return result;
  }, [sessions]);

  const dayOfWeekData = useMemo(() => {
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const byDay = [0, 0, 0, 0, 0, 0, 0];
    sessions.forEach((s) => {
      const day = new Date(s.date + 'T12:00:00').getDay();
      byDay[day] += s.minutes || 0;
    });
    return dayNames.map((name, i) => ({
      name,
      dayIndex: i,
      minutes: byDay[i],
    }));
  }, [sessions]);

  const monthlyCompletedData = useMemo(() => {
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const monthStart = format(startOfMonth(d), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(d), 'yyyy-MM-dd');
      const count = readBooks.filter((b) => {
        const fin = (b.finishedAt || '').slice(0, 10);
        return fin >= monthStart && fin <= monthEnd;
      }).length;
      result.push({
        monthKey: format(d, 'yyyy-MM'),
        label: format(d, 'M月', { locale: ja }),
        yearMonth: format(d, 'yyyy年M月', { locale: ja }),
        count,
      });
    }
    return result;
  }, [readBooks]);

  const ratingDistributionData = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    readBooks.forEach((b) => {
      const r = Number(b.rating);
      if (r >= 1 && r <= 5) counts[r] += 1;
    });
    return [1, 2, 3, 4, 5].map((r) => ({
      rating: `${r}★`,
      count: counts[r],
      fullLabel: `${r}星`,
    }));
  }, [readBooks]);

  const periodMinutes = useMemo(() => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    let todayMinutes = 0;
    let weekMinutes = 0;
    let monthMinutes = 0;
    sessions.forEach((s) => {
      const d = s.date;
      if (d === todayStr) todayMinutes += s.minutes || 0;
      if (d >= format(weekStart, 'yyyy-MM-dd') && d <= format(weekEnd, 'yyyy-MM-dd')) {
        weekMinutes += s.minutes || 0;
      }
      if (d >= format(monthStart, 'yyyy-MM-dd') && d <= format(monthEnd, 'yyyy-MM-dd')) {
        monthMinutes += s.minutes || 0;
      }
    });
    return { todayMinutes, weekMinutes, monthMinutes };
  }, [sessions]);

  const goals = getSettings();
  const dailyGoalMinutes = goals.dailyGoalMinutes || 0;
  const weeklyGoalMinutes = goals.weeklyGoalMinutes || 0;
  const monthlyGoalMinutes = goals.monthlyGoalMinutes || 0;
  const yearlyGoalMinutes = goals.yearlyGoalMinutes || 0;
  const bookGoalCount = goals.bookGoalCount || 0;

  const dailyProgress = dailyGoalMinutes > 0
    ? Math.min(periodMinutes.todayMinutes / dailyGoalMinutes, 1)
    : 0;
  const weeklyProgress = weeklyGoalMinutes > 0
    ? Math.min(periodMinutes.weekMinutes / weeklyGoalMinutes, 1)
    : 0;
  const monthlyProgress = monthlyGoalMinutes > 0
    ? Math.min(periodMinutes.monthMinutes / monthlyGoalMinutes, 1)
    : 0;
  const yearlyProgress = yearlyGoalMinutes > 0
    ? Math.min(totalMinutes / yearlyGoalMinutes, 1)
    : 0;
  const bookProgress = bookGoalCount > 0
    ? Math.min(completedCount / bookGoalCount, 1)
    : 0;

  const hasAnyGoal = dailyGoalMinutes > 0 || weeklyGoalMinutes > 0 || monthlyGoalMinutes > 0
    || yearlyGoalMinutes > 0 || bookGoalCount > 0;

  const hasNoReadingData = totalMinutes === 0;

  return (
    <div className="page-wrapper stats-page">
      <div className="stats-page-card">
        <div className="stats-page-card-content">
          <h2 className="page-heading stats-page-heading">Stats</h2>
          <p className="stats-page-sub">読書の統計と分析</p>

          {hasNoReadingData && (
            <p className="stats-page-cta">
              <Link to="/reading" className="stats-page-cta-link" title="読書タイマーを開く">
                今日からタイマーで記録を始めよう
              </Link>
            </p>
          )}

          <section className="stats-section" aria-labelledby="stats-summary-heading">
            <h3 id="stats-summary-heading" className="stats-section-title">
              サマリー
            </h3>
            <div className="stats-summary-grid">
              <div className="stats-summary-item">
                <span className="stats-summary-value">{formatMinutes(totalMinutes)}</span>
                <span className="stats-summary-label">総読書時間</span>
              </div>
              <div className="stats-summary-item">
                <span className="stats-summary-value">{sessions.length}</span>
                <span className="stats-summary-label">記録数</span>
              </div>
              {avgSessionMinutes != null && (
                <div className="stats-summary-item">
                  <span className="stats-summary-value">{formatMinutes(avgSessionMinutes)}</span>
                  <span className="stats-summary-label">1回あたりの平均</span>
                </div>
              )}
              <div className="stats-summary-item">
                <span className="stats-summary-value">{completedCount}冊</span>
                <span className="stats-summary-label">読了</span>
              </div>
              {avgRating != null && (
                <div className="stats-summary-item">
                  <span className="stats-summary-value">{avgRating}</span>
                  <span className="stats-summary-label">平均評価（★）</span>
                </div>
              )}
            </div>
          </section>

          {hasAnyGoal && (
            <section className="stats-section" aria-labelledby="stats-goals-heading">
              <h3 id="stats-goals-heading" className="stats-section-title">
                目標の進捗
              </h3>
              <div className="stats-goals">
                {dailyGoalMinutes > 0 && (
                  <div className="stats-goal-item">
                    <div className="stats-goal-header">
                      <span className="stats-goal-label">今日の目標（時間）</span>
                      <span className="stats-goal-value">
                        {formatMinutes(periodMinutes.todayMinutes)} / {formatMinutes(dailyGoalMinutes)}
                      </span>
                    </div>
                    <div className="stats-goal-bar-wrap">
                      <div
                        className="stats-goal-bar"
                        style={{ width: `${Math.round(dailyProgress * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(dailyProgress * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
                {weeklyGoalMinutes > 0 && (
                  <div className="stats-goal-item">
                    <div className="stats-goal-header">
                      <span className="stats-goal-label">今週の目標（時間）</span>
                      <span className="stats-goal-value">
                        {formatMinutes(periodMinutes.weekMinutes)} / {formatMinutes(weeklyGoalMinutes)}
                      </span>
                    </div>
                    <div className="stats-goal-bar-wrap">
                      <div
                        className="stats-goal-bar"
                        style={{ width: `${Math.round(weeklyProgress * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(weeklyProgress * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
                {monthlyGoalMinutes > 0 && (
                  <div className="stats-goal-item">
                    <div className="stats-goal-header">
                      <span className="stats-goal-label">今月の目標（時間）</span>
                      <span className="stats-goal-value">
                        {formatMinutes(periodMinutes.monthMinutes)} / {formatMinutes(monthlyGoalMinutes)}
                      </span>
                    </div>
                    <div className="stats-goal-bar-wrap">
                      <div
                        className="stats-goal-bar"
                        style={{ width: `${Math.round(monthlyProgress * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(monthlyProgress * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
                {yearlyGoalMinutes > 0 && (
                  <div className="stats-goal-item">
                    <div className="stats-goal-header">
                      <span className="stats-goal-label">年間目標（時間）</span>
                      <span className="stats-goal-value">
                        {formatMinutes(totalMinutes)} / {formatMinutes(yearlyGoalMinutes)}
                      </span>
                    </div>
                    <div className="stats-goal-bar-wrap">
                      <div
                        className="stats-goal-bar"
                        style={{ width: `${Math.round(yearlyProgress * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(yearlyProgress * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
                {bookGoalCount > 0 && (
                  <div className="stats-goal-item">
                    <div className="stats-goal-header">
                      <span className="stats-goal-label">読了冊数目標</span>
                      <span className="stats-goal-value">
                        {completedCount}冊 / {bookGoalCount}冊
                      </span>
                    </div>
                    <div className="stats-goal-bar-wrap">
                      <div
                        className="stats-goal-bar"
                        style={{ width: `${Math.round(bookProgress * 100)}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(bookProgress * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {sessions.length > 0 && (
            <section className="stats-section stats-streak" aria-labelledby="stats-streak-heading">
              <h3 id="stats-streak-heading" className="stats-section-title">
                連続読書日数（ストリーク）
              </h3>
              <div className="stats-streak-grid">
                <div className="stats-streak-item">
                  <span className="stats-streak-value">{streakData.currentStreak}</span>
                  <span className="stats-streak-label">現在の連続日数</span>
                </div>
                <div className="stats-streak-item">
                  <span className="stats-streak-value">{streakData.longestStreak}</span>
                  <span className="stats-streak-label">最長連続日数</span>
                </div>
              </div>
            </section>
          )}

          {sessions.length > 0 && (
            <section className="stats-section" aria-labelledby="stats-weekly-heading">
              <h3 id="stats-weekly-heading" className="stats-section-title">
                直近7日間の読書時間
              </h3>
              <div className="stats-chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyTrendData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                      tickFormatter={(v) => `${v}分`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}分`, '読書時間']}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullLabel || ''
                      }
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #eee',
                      }}
                    />
                    <Bar dataKey="minutes" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {sessions.length > 0 && (
            <section className="stats-section" aria-labelledby="stats-dow-heading">
              <h3 id="stats-dow-heading" className="stats-section-title">
                曜日別の傾向
              </h3>
              <div className="stats-chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dayOfWeekData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                      tickFormatter={(v) => `${v}分`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}分`, '読書時間']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #eee',
                      }}
                    />
                    <Bar dataKey="minutes" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <section className="stats-section" aria-labelledby="stats-monthly-heading">
            <h3 id="stats-monthly-heading" className="stats-section-title">
              月別読書時間（直近12ヶ月）
            </h3>
            <div className="stats-chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#666"
                    tickFormatter={(v) => `${v}分`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}分`, '読書時間']}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.yearMonth || ''
                    }
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #eee',
                    }}
                  />
                  <Bar dataKey="minutes" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {readBooks.length > 0 && (
              <>
                <h4 className="stats-subsection-title">月別読了冊数</h4>
                <div className="stats-chart-wrap stats-chart-wrap--small">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthlyCompletedData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#666' }}
                        stroke="#666"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#666' }}
                        stroke="#666"
                        tickFormatter={(v) => `${v}冊`}
                        width={28}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}冊`, '読了']}
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload?.yearMonth || ''
                        }
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #eee',
                        }}
                      />
                      <Bar dataKey="count" fill="#047857" radius={[4, 4, 0, 0]} name="読了" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>

          {tagStats.length > 0 && (
            <section className="stats-section" aria-labelledby="stats-tags-heading">
              <h3 id="stats-tags-heading" className="stats-section-title">
                タグ別読書時間（本と紐付いた記録のみ）
              </h3>
              <ul className="stats-list">
                {tagStats.map(({ tag, minutes }) => (
                  <li key={tag} className="stats-list-item">
                    <span className="stats-list-label">{tag}</span>
                    <span className="stats-list-value">{formatMinutes(minutes)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {authorStats.length > 0 && (
            <section className="stats-section" aria-labelledby="stats-authors-heading">
              <h3 id="stats-authors-heading" className="stats-section-title">
                著者別読書時間（本と紐付いた記録のみ）
              </h3>
              <ul className="stats-list">
                {authorStats.map(({ author, minutes }) => (
                  <li key={author} className="stats-list-item">
                    <span className="stats-list-label">{author}</span>
                    <span className="stats-list-value">{formatMinutes(minutes)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ratingDistributionData.some((d) => d.count > 0) && (
            <section className="stats-section" aria-labelledby="stats-rating-heading">
              <h3 id="stats-rating-heading" className="stats-section-title">
                評価の分布（読了本）
              </h3>
              <div className="stats-chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingDistributionData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="rating"
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      stroke="#666"
                      tickFormatter={(v) => `${v}冊`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}冊`, '冊数']}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullLabel || ''
                      }
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #eee',
                      }}
                    />
                    <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} name="冊数" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
