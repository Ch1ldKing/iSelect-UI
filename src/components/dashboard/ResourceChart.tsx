import { Card } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { colors } from '../../theme/colors';

interface ResourceData {
  timestamp: string;
  cpu: number;
  memory: number;
  vram: number;
}

interface ResourceChartProps {
  data: ResourceData[];
  loading?: boolean;
}

const ResourceChart: React.FC<ResourceChartProps> = ({ data, loading = false }) => {
  return (
    <Card title="资源使用趋势" bordered={false} loading={loading}>
      <ResponsiveContainer width="100%" height={300} minWidth={300}>
        <LineChart 
          data={data} 
          margin={{ 
            top: 5, 
            right: window.innerWidth < 768 ? 10 : 30, 
            left: window.innerWidth < 768 ? 0 : 20, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            }}
          />
          <YAxis
            tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            width={window.innerWidth < 768 ? 40 : 60}
          />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}%` : '-'}
            labelFormatter={(label) => {
              const date = new Date(label as string);
              return date.toLocaleString('zh-CN');
            }}
          />
          <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? 11 : 14 }} />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke={colors.primary.main}
            strokeWidth={2}
            name="CPU 使用率"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke={colors.secondary.main}
            strokeWidth={2}
            name="内存使用率"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="vram"
            stroke={colors.status.warning}
            strokeWidth={2}
            name="显存使用率"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ResourceChart;
