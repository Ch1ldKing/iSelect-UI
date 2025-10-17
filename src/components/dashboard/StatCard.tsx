import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';
import { colors } from '../../theme/colors';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
  suffix?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = colors.primary.main,
  suffix,
  loading = false,
}) => {
  return (
    <Card
      bordered={false}
      loading={loading}
      style={{
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Statistic
          title={title}
          value={value}
          suffix={suffix}
          valueStyle={{ color, fontSize: '28px', fontWeight: 'bold' }}
        />
        <div
          style={{
            fontSize: '40px',
            color,
            opacity: 0.8,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
