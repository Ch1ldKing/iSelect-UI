import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Skeleton, Card as AntCard } from 'antd';
import {
  CloudServerOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import StatCard from '../../components/dashboard/StatCard';
import ResourceChart from '../../components/dashboard/ResourceChart';
import TaskStatusChart from '../../components/dashboard/TaskStatusChart';
import RealtimeTaskList from '../../components/dashboard/RealtimeTaskList';
import { useWorkerStore } from '../../store/workerStore';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

interface ResourceData {
  timestamp: string;
  cpu: number;
  memory: number;
  vram: number;
}

const Dashboard: React.FC = () => {
  const clientId = useAuthStore((state) => state.clientId);
  const { workers, onlineCount, availableCount, startPolling, stopPolling } =
    useWorkerStore();
  const { tasks, fetchTasks } = useTaskStore();

  const [resourceHistory, setResourceHistory] = useState<ResourceData[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // 计算运行中的任务数量
  const runningTasksCount = useMemo(() => {
    return tasks.filter((task) => task.task_status === 'running').length;
  }, [tasks]);

  // 计算今日完成的任务数量
  const todayCompletedCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((task) => {
      if (task.task_status !== 'success') return false;
      if (!task.completed_at) return false;
      const completedDate = new Date(task.completed_at);
      return completedDate >= today;
    }).length;
  }, [tasks]);

  // 计算任务状态分布数据
  const taskStatusData = useMemo(() => {
    const statusMap: Record<string, { name: string; count: number }> = {
      success: { name: '成功', count: 0 },
      running: { name: '运行中', count: 0 },
      failure: { name: '失败', count: 0 },
      waiting: { name: '等待中', count: 0 },
    };

    tasks.forEach((task) => {
      const status = task.task_status;
      if (status === 'success' || status === 'failure' || status === 'running') {
        statusMap[status].count++;
      } else {
        statusMap.waiting.count++;
      }
    });

    return Object.entries(statusMap)
      .filter(([_, data]) => data.count > 0)
      .map(([status, data]) => ({
        name: data.name,
        value: data.count,
        status,
      }));
  }, [tasks]);

  // 更新资源历史数据
  useEffect(() => {
    if (workers.length === 0) return;

    const avgCpu =
      workers.reduce((sum, w) => sum + w.cpu_usage_percent, 0) / workers.length;
    const avgMemory =
      workers.reduce((sum, w) => sum + w.memory_usage_percent, 0) / workers.length;
    const avgVram =
      workers.reduce((sum, w) => sum + w.vram_usage_percent, 0) / workers.length;

    setResourceHistory((prev) => {
      const newData = [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          cpu: avgCpu,
          memory: avgMemory,
          vram: avgVram,
        },
      ];
      // 只保留最近 20 个数据点
      return newData.slice(-20);
    });
  }, [workers]);

  // 启动轮询
  useEffect(() => {
    if (!clientId) return;

    // 启动 Worker 轮询（5 秒）
    startPolling(5000);

    // 获取任务列表
    fetchTasks();

    // 启动任务列表轮询（5 秒）
    const taskPollingInterval = setInterval(() => {
      fetchTasks();
    }, 5000);

    // 设置初始加载完成
    const loadingTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    // 清理函数
    return () => {
      stopPolling();
      clearInterval(taskPollingInterval);
      clearTimeout(loadingTimer);
    };
  }, [clientId, startPolling, stopPolling, fetchTasks]);

  // 显示骨架屏
  if (initialLoading) {
    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <AntCard>
                <Skeleton active paragraph={{ rows: 2 }} />
              </AntCard>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <AntCard>
              <Skeleton active paragraph={{ rows: 6 }} />
            </AntCard>
          </Col>
          <Col xs={24} lg={8}>
            <AntCard>
              <Skeleton active paragraph={{ rows: 6 }} />
            </AntCard>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AntCard>
              <Skeleton active paragraph={{ rows: 4 }} />
            </AntCard>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="在线 Worker"
            value={onlineCount}
            icon={<CloudServerOutlined />}
            color={colors.primary.main}
            suffix="个"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="可用 Worker"
            value={availableCount}
            icon={<CheckCircleOutlined />}
            color={colors.status.success}
            suffix="个"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="运行中任务"
            value={runningTasksCount}
            icon={<SyncOutlined spin={runningTasksCount > 0} />}
            color={colors.status.processing}
            suffix="个"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日完成"
            value={todayCompletedCount}
            icon={<TrophyOutlined />}
            color={colors.status.warning}
            suffix="个"
          />
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <ResourceChart data={resourceHistory} />
        </Col>
        <Col xs={24} lg={8}>
          <TaskStatusChart data={taskStatusData} />
        </Col>
      </Row>

      {/* 实时任务列表 */}
      <Row>
        <Col span={24}>
          <RealtimeTaskList tasks={tasks} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
