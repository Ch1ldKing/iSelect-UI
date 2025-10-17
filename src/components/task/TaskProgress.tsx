import { Card, Space, Typography } from 'antd';
import type { Task } from '../../types';
import { calculateProgress } from '../../utils';
import ProgressBar from '../common/ProgressBar';

const { Text } = Typography;

interface TaskProgressProps {
  task: Task;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ task }) => {
  const progress = calculateProgress(task.subtask_list, task.current_round, task.max_rounds);
  
  const getStatusText = () => {
    switch (task.task_status) {
      case 'success':
        return '任务已完成';
      case 'failure':
        return '任务失败';
      case 'running':
        return '任务执行中';
      case 'retrying':
        return '任务重试中';
      case 'init':
      case 'assigned':
        return '任务初始化中';
      default:
        return '任务进行中';
    }
  };

  const getProgressStatus = () => {
    if (task.task_status === 'success') return 'success';
    if (task.task_status === 'failure') return 'exception';
    return 'active';
  };

  return (
    <Card title="任务进度" bordered={false}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong>整体进度: {progress.toFixed(1)}%</Text>
        </div>
        <ProgressBar 
          percent={progress} 
          status={getProgressStatus()}
          strokeColor={task.task_status === 'failure' ? '#f5222d' : undefined}
        />
        <div>
          <Text type="secondary">{getStatusText()}</Text>
        </div>
        <div>
          <Text type="secondary">
            已完成子任务: {task.subtask_list.filter(s => s.subtask_status === 'success').length} / {task.subtask_list.length}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default TaskProgress;
