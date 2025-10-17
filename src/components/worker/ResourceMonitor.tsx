import { Card, Radio, Space } from 'antd';
import { useState } from 'react';
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
import type { ResourceData } from '../../types/worker';
import { colors } from '../../theme/colors';

interface ResourceMonitorProps {
  data: ResourceData[];
}

type ResourceType = 'all' | 'cpu' | 'memory' | 'vram';

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ data }) => {
  const [resourceType, setResourceType] = useState<ResourceType>('all');

  // 格式化时间戳显示
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card
      title="实时资源监控"
      bordered
      style={{
        borderColor: '#b7eb8f',
      }}
      extra={
        <Space>
          <span>显示资源：</span>
          <Radio.Group
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="cpu">CPU</Radio.Button>
            <Radio.Button value="memory">内存</Radio.Button>
            <Radio.Button value="vram">显存</Radio.Button>
          </Radio.Group>
        </Space>
      }
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            label={{ value: '时间', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: '使用率 (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip
            labelFormatter={formatTime}
            formatter={(value: number) => `${value.toFixed(1)}%`}
          />
          <Legend />
          {(resourceType === 'all' || resourceType === 'cpu') && (
            <Line
              type="monotone"
              dataKey="cpu"
              stroke={colors.primary.main}
              strokeWidth={2}
              name="CPU 使用率"
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {(resourceType === 'all' || resourceType === 'memory') && (
            <Line
              type="monotone"
              dataKey="memory"
              stroke={colors.secondary.main}
              strokeWidth={2}
              name="内存使用率"
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {(resourceType === 'all' || resourceType === 'vram') && (
            <Line
              type="monotone"
              dataKey="vram"
              stroke={colors.status.warning}
              strokeWidth={2}
              name="显存使用率"
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ResourceMonitor;
