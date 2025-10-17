import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

interface StatusBadgeProps {
  status: string;
  text?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'success':
        return {
          color: '#52c41a',
          icon: <CheckCircleOutlined />,
          label: text || '成功',
        };
      case 'failure':
      case 'failed':
      case 'error':
        return {
          color: '#f5222d',
          icon: <CloseCircleOutlined />,
          label: text || '失败',
        };
      case 'running':
      case 'computing':
      case 'processing':
        return {
          color: '#13c2c2',
          icon: <SyncOutlined spin />,
          label: text || '运行中',
        };
      case 'waiting':
      case 'pending':
        return {
          color: '#faad14',
          icon: <ClockCircleOutlined />,
          label: text || '等待中',
        };
      case 'online':
        return {
          color: '#52c41a',
          icon: <CheckCircleOutlined />,
          label: text || '在线',
        };
      case 'offline':
        return {
          color: '#d9d9d9',
          icon: <MinusCircleOutlined />,
          label: text || '离线',
        };
      case 'init':
      case 'assigned':
        return {
          color: '#1890ff',
          icon: <ClockCircleOutlined />,
          label: text || '初始化',
        };
      case 'retrying':
        return {
          color: '#faad14',
          icon: <SyncOutlined spin />,
          label: text || '重试中',
        };
      default:
        return {
          color: '#d9d9d9',
          icon: <MinusCircleOutlined />,
          label: text || status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

export default StatusBadge;
