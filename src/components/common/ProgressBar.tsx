import { Progress } from 'antd';

interface ProgressBarProps {
  percent: number;
  showInfo?: boolean;
  status?: 'success' | 'exception' | 'normal' | 'active';
  strokeColor?: string;
  size?: 'default' | 'small';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  showInfo = true,
  status,
  strokeColor,
  size = 'default',
}) => {
  // Determine status based on percent if not provided
  const getStatus = () => {
    if (status) return status;
    if (percent === 100) return 'success';
    if (percent >= 80) return 'normal';
    return 'active';
  };

  // Determine stroke color based on percent if not provided
  const getStrokeColor = () => {
    if (strokeColor) return strokeColor;
    if (percent >= 80) return '#faad14'; // Warning color for high usage
    return '#52c41a'; // Primary green color
  };

  return (
    <Progress
      percent={Math.min(Math.max(percent, 0), 100)}
      showInfo={showInfo}
      status={getStatus()}
      strokeColor={getStrokeColor()}
      size={size}
    />
  );
};

export default ProgressBar;
