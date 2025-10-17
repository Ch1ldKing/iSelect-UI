import { Card, Descriptions } from 'antd';
import type { Task } from '../../types';
import { formatDateTime } from '../../utils';
import StatusBadge from '../common/StatusBadge';

interface TaskInfoProps {
  task: Task;
}

const TaskInfo: React.FC<TaskInfoProps> = ({ task }) => {
  return (
    <Card title="任务信息" bordered={false}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="任务 ID">{task.task_id}</Descriptions.Item>
        <Descriptions.Item label="算法">{task.function_id}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <StatusBadge status={task.task_status} />
        </Descriptions.Item>
        <Descriptions.Item label="重试次数">{task.retry_times}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {formatDateTime(task.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="完成时间">
          {task.completed_at ? formatDateTime(task.completed_at) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="当前轮次">
          {task.current_round} / {task.max_rounds}
        </Descriptions.Item>
        <Descriptions.Item label="任务量">{task.task_volume}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TaskInfo;
