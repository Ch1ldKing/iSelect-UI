import { useEffect, useState } from 'react';
import { Card, Input, Select, Button, Space, Row, Col, Skeleton } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useWorkerStore } from '../../store/workerStore';
import { useAuthStore } from '../../store/authStore';
import WorkerTable from '../../components/worker/WorkerTable';
import type { Worker } from '../../types/worker';

const { Search } = Input;
const { Option } = Select;

const WorkerList: React.FC = () => {
  const { workers, loading, fetchWorkers, startPolling, stopPolling } = useWorkerStore();
  const { isAuthenticated } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // 启动 5 秒轮询
      startPolling(5000);
      
      // 设置初始加载完成
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 800);

      // 组件卸载时清除轮询和定时器
      return () => {
        stopPolling();
        clearTimeout(timer);
      };
    }
  }, [isAuthenticated, startPolling, stopPolling]);

  // 过滤 Worker 列表
  const filteredWorkers: Worker[] = workers.filter((worker) => {
    // 按 Worker ID 搜索
    const matchesSearch = searchText
      ? worker.worker_id.toLowerCase().includes(searchText.toLowerCase())
      : true;

    // 按状态筛选
    const matchesStatus =
      statusFilter === 'all' || worker.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 手动刷新
  const handleRefresh = () => {
      fetchWorkers();
  };

  return (
    <div>
      <Card
        title="Worker 列表"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading && !initialLoading}
          >
            刷新
          </Button>
        }
      >
        {initialLoading ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input active style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input active style={{ width: '100%' }} />
              </Col>
            </Row>
            <Skeleton active paragraph={{ rows: 5 }} />
          </Space>
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 搜索和筛选栏 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="按 Worker ID 搜索"
                  allowClear
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={setSearchText}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  <Option value="all">全部</Option>
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                </Select>
              </Col>
            </Row>

            {/* Worker 表格 */}
            <WorkerTable workers={filteredWorkers} loading={loading} />
          </Space>
        )}
      </Card>
    </div>
  );
};

export default WorkerList;
