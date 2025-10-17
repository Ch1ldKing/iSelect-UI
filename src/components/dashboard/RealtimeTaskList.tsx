import { Card, List, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import type { Task } from '../../types/task';

interface RealtimeTaskListProps {
  tasks: Task[];
  loading?: boolean;
}

const RealtimeTaskList: React.FC<RealtimeTaskListProps> = ({ tasks, loading = false }) => {
  const navigate = useNavigate();

  const calculateProgress = (task: Task): number => {
    if (task.subtask_list.length === 0) return 0;
    const totalProgress = task.subtask_list.reduce((sum, subtask) => {
      const progress = parseFloat(subtask.progress.replace('%', ''));
      return sum + progress;
    }, 0);
    return totalProgress / task.subtask_list.length;
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Card title="实时任务列表" bordered={false} loading={loading}>
      <List
        dataSource={tasks.slice(0, 5)}
        locale={{ emptyText: '暂无任务' }}
        renderItem={(task) => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => handleTaskClick(task.task_id)}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>任务 ID: {task.task_id}</span>
                  <StatusBadge status={task.task_status} />
                </Space>
              }
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>
                    算法: {task.function_id} | 创建时间:{' '}
                    {new Date(task.created_at).toLocaleString('zh-CN')}
                  </div>
                  <ProgressBar
                    percent={calculateProgress(task)}
                    size="small"
                    status={
                      task.task_status === 'success'
                        ? 'success'
                        : task.task_status === 'failure'
                        ? 'exception'
                        : 'active'
                    }
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RealtimeTaskList;
