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

function WeeklyReadingChart({ compact = false }) {
  const sessions = getReadingSessions();

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

  const chartHeight = compact ? 120 : 260;
  const margin = compact ? { top: 4, right: 4, left: 0, bottom: 0 } : { top: 8, right: 8, left: 0, bottom: 8 };

  return (
    <section className={`weekly-reading-chart card ${compact ? 'weekly-reading-chart--compact' : ''}`}>
      <div className="weekly-reading-chart-header">
        <h2 className="weekly-reading-chart-title">
          {compact ? '今週の読書' : '直近1週間の読書時間'}
        </h2>
        {compact && (
          <Link to="/reading" className="weekly-reading-chart-link">
            詳細は Reading Time へ →
          </Link>
        )}
      </div>
      <div className="weekly-reading-chart-container">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={chartData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: compact ? 10 : 12 }}
              stroke="#666"
            />
            <YAxis
              tick={{ fontSize: compact ? 10 : 12 }}
              stroke="#666"
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
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#1a1a2e"
              strokeWidth={compact ? 1.5 : 2}
              dot={{ fill: '#1a1a2e', r: compact ? 2 : 4 }}
              activeDot={{ r: compact ? 4 : 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default WeeklyReadingChart;
