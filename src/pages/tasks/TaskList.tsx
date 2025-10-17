import { useEffect, useState } from 'react';
import { Card, Input, Select, Button, Space, Row, Col, Skeleton } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { TaskTable } from '../../components/task';
import type { Task } from '../../types/task';

const { Search } = Input;
const { Option } = Select;

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTaskStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(
    null
  );
  const [initialLoading, setInitialLoading] = useState(true);

  // 过滤任务列表
  const filteredTasks = tasks.filter((task: Task) => {
    // 搜索过滤
    const matchesSearch =
      searchText === '' ||
      task.task_id.toLowerCase().includes(searchText.toLowerCase()) ||
      task.function_id.toLowerCase().includes(searchText.toLowerCase());

    // 状态过滤
    const matchesStatus =
      statusFilter === 'all' ||
      task.task_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 启动轮询
  const startPolling = () => {
    // 立即获取一次数据（非静默模式，显示加载状态）
    fetchTasks(false);

    // 启动 5 秒轮询（静默模式，不显示加载状态）
    const interval = setInterval(() => {
      fetchTasks(true);
    }, 5000);

    setPollingInterval(interval);
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // 组件挂载时启动轮询
  useEffect(() => {
    startPolling();

    // 设置初始加载完成
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);

    // 组件卸载时清除轮询和定时器
    return () => {
      stopPolling();
      clearTimeout(timer);
    };
  }, []);

  // 手动刷新
  const handleRefresh = () => {
    fetchTasks();
  };

  // 导航到创建任务页面
  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  return (
    <div>
      <Card
        title="任务列表"
        extra={
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTask}
            >
              创建任务
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading && !initialLoading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        {initialLoading ? (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input active style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input active style={{ width: '100%' }} />
              </Col>
            </Row>
            <Skeleton active paragraph={{ rows: 5 }} />
          </>
        ) : (
          <>
            {/* 搜索和筛选区域 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="搜索任务 ID 或算法名称"
                  allowClear
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={(value) => setSearchText(value)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="all">全部状态</Option>
                  <Option value="init">初始化</Option>
                  <Option value="assigned">已分配</Option>
                  <Option value="running">运行中</Option>
                  <Option value="success">成功</Option>
                  <Option value="failure">失败</Option>
                  <Option value="retrying">重试中</Option>
                </Select>
              </Col>
            </Row>

            {/* 任务表格 */}
            <TaskTable tasks={filteredTasks} loading={loading} />
          </>
        )}
      </Card>
    </div>
  );
};

export default TaskList;
