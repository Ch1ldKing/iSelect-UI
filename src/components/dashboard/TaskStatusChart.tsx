import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colors } from '../../theme/colors';

interface TaskStatusData {
  name: string;
  value: number;
  status: string;
  [key: string]: string | number;
}

interface TaskStatusChartProps {
  data: TaskStatusData[];
  loading?: boolean;
}

const COLORS: Record<string, string> = {
  success: colors.status.success,
  running: colors.status.processing,
  failure: colors.status.error,
  waiting: colors.status.warning,
  init: colors.status.info,
  assigned: colors.status.info,
  retrying: colors.status.warning,
};

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data, loading = false }) => {
  const isMobile = window.innerWidth < 768;
  
  const renderLabel = (props: any) => {
    // Hide labels on very small screens
    if (window.innerWidth < 576) {
      return '';
    }
    const { name, value } = props;
    return `${name}: ${value}`;
  };

  return (
    <Card title="任务状态分布" bordered={false} loading={loading}>
      <ResponsiveContainer width="100%" height={300} minWidth={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={!isMobile}
            label={renderLabel}
            outerRadius={isMobile ? 70 : 100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.status] || colors.neutral.border}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} 个任务`} />
          <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 14 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TaskStatusChart;
