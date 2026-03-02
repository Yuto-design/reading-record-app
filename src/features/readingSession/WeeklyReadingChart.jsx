import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getReadingSessions } from '../../utils/storage';
import './styles/WeeklyReadingChart.css';

function WeeklyReadingChart({ compact = false, theme = 'light', fullHeight = false }) {
  const sessions = getReadingSessions();
  const isDark = theme === 'dark';
  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#eee';
  const axisStroke = isDark ? 'rgba(255,255,255,0.4)' : '#666';
  const lineStroke = isDark ? '#93c5fd' : '#1a1a2e';

  const chartData = useMemo(() => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      last7.push({
        date: format(d, 'yyyy-MM-dd'),
        label: format(d, 'M/d', { locale: ja }),
        minutes: 0,
      });
    }
    const byDate = {};
    last7.forEach((row) => {
      byDate[row.date] = row;
    });
    sessions.forEach((s) => {
      if (byDate[s.date]) byDate[s.date].minutes += s.minutes;
    });
    return last7;
  }, [sessions]);

  const chartHeight = fullHeight ? '100%' : (compact ? 120 : 260);
  const margin = compact ? { top: 4, right: 4, left: 0, bottom: 0 } : { top: 8, right: 8, left: 0, bottom: 8 };

  return (
    <section className={`weekly-reading-chart card ${compact ? 'weekly-reading-chart--compact' : ''} ${fullHeight ? 'weekly-reading-chart--full-height' : ''} ${theme === 'dark' ? 'weekly-reading-chart--dark' : ''}`}>
      <div className="weekly-reading-chart-header">
        <h2 className="weekly-reading-chart-title">
          {compact ? '今週の読書' : '直近1週間の読書時間'}
        </h2>
        {compact && !fullHeight && (
          <Link to="/reading" className="weekly-reading-chart-link">
            詳細は Reading Time へ →
          </Link>
        )}
      </div>
      <div className="weekly-reading-chart-container">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={chartData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: compact ? 10 : 12, fill: axisStroke }}
              stroke={axisStroke}
            />
            <YAxis
              tick={{ fontSize: compact ? 10 : 12, fill: axisStroke }}
              stroke={axisStroke}
              tickFormatter={(v) => (compact ? `${v}` : `${v}分`)}
              width={compact ? 24 : undefined}
            />
            <Tooltip
              formatter={(value) => [`${value}分`, '読書時間']}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.date
                  ? format(parseISO(payload[0].payload.date), 'yyyy年M月d日', {
                      locale: ja,
                    })
                  : ''
              }
              contentStyle={
                isDark
                  ? {
                      background: '#1a1a1d',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fafafa',
                    }
                  : undefined
              }
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke={lineStroke}
              strokeWidth={compact ? 1.5 : 2}
              dot={{ fill: lineStroke, r: compact ? 2 : 4 }}
              activeDot={{ r: compact ? 4 : 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default WeeklyReadingChart;
