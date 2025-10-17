import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Space, Button, Card, Spin, message, Modal } from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '../../store/taskStore';
import TaskInfo from '../../components/task/TaskInfo';
import TaskProgress from '../../components/task/TaskProgress';
import SubtaskTable from '../../components/task/SubtaskTable';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTask, loading, fetchTaskDetail, startPolling, stopPolling } = useTaskStore();

  useEffect(() => {
    if (id) {
      // 启动轮询，每 3 秒更新一次
      startPolling(id, 3000);
    }

    // 组件卸载时清除轮询
    return () => {
      stopPolling();
    };
  }, [id, startPolling, stopPolling]);

  const handleDownloadResult = () => {
    if (currentTask?.result) {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = currentTask.result;
      link.download = `task_${currentTask.task_id}_result.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('结果下载已开始');
    } else {
      message.warning('暂无可下载的结果');
    }
  };

  const handleRetryTask = () => {
    Modal.confirm({
      title: '确认重试任务',
      content: '确定要重试这个任务吗？系统将重新分配 Worker 并执行任务。',
      okText: '确认重试',
      cancelText: '取消',
      okButtonProps: { danger: false },
      onOk: async () => {
        try {
          // TODO: 调用重试任务 API
          message.success('任务重试已提交');
          if (id) {
            fetchTaskDetail(id);
          }
        } catch (error) {
          message.error('任务重试失败，请稍后再试');
          console.error('Retry task error:', error);
        }
      },
    });
  };

  const handleCancelTask = () => {
    Modal.confirm({
      title: '确认取消任务',
      content: '确定要取消这个任务吗？取消后任务将停止执行且无法恢复。',
      okText: '确认取消',
      cancelText: '我再想想',
      okType: 'danger',
      onOk: async () => {
        try {
          // TODO: 调用取消任务 API
          message.success('任务已取消');
          if (id) {
            fetchTaskDetail(id);
          }
        } catch (error) {
          message.error('任务取消失败，请稍后再试');
          console.error('Cancel task error:', error);
        }
      },
    });
  };

  const handleBack = () => {
    navigate('/tasks');
  };

  if (loading && !currentTask) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载任务详情中..." />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>任务不存在或加载失败</p>
          <Button type="primary" onClick={handleBack}>
            返回任务列表
          </Button>
        </div>
      </Card>
    );
  }

  const isRunning = ['init', 'assigned', 'running', 'retrying'].includes(currentTask.task_status);
  const isSuccess = currentTask.task_status === 'success';
  const isFailure = currentTask.task_status === 'failure';

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部 */}
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回任务列表
            </Button>
            <Space>
              {isSuccess && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadResult}
                >
                  下载结果
                </Button>
              )}
              {isFailure && (
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleRetryTask}
                >
                  重试任务
                </Button>
              )}
              {isRunning && (
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={handleCancelTask}
                >
                  取消任务
                </Button>
              )}
            </Space>
          </Space>
        </Card>

        {/* 任务信息 */}
        <TaskInfo task={currentTask} />

        {/* 任务进度 */}
        <TaskProgress task={currentTask} />

        {/* 子任务列表 */}
        <Card title="子任务列表" bordered={false}>
          <SubtaskTable subtasks={currentTask.subtask_list} />
        </Card>
      </Space>
    </div>
  );
};

export default TaskDetail;
