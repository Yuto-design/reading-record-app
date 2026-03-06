import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions, getBooks } from '../utils/storage';
import { formatMinutes } from '../utils/changeTime';
import './styles/PageCommon.css';
import './styles/StatsPage.css';

function StatsPage() {
  const sessions = getReadingSessions();
  const books = getBooks();

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

  return (
    <div className="page-wrapper stats-page">
      <div className="stats-page-card">
        <div className="stats-page-card-bg" aria-hidden="true" />
        <div className="stats-page-card-content">
          <h2 className="page-heading stats-page-heading">Stats</h2>
          <p className="stats-page-sub">読書の統計と分析</p>

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
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
