import { useMemo } from 'react';
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
import './WeeklyReadingChart.css';

function WeeklyReadingChart() {
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

  return (
    <section className="weekly-reading-chart card">
      <h2 className="weekly-reading-chart-title">直近1週間の読書時間</h2>
      <div className="weekly-reading-chart-container">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(v) => `${v}分`}
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
              strokeWidth={2}
              dot={{ fill: '#1a1a2e', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default WeeklyReadingChart;
