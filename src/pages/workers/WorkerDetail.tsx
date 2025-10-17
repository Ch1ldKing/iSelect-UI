import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Space, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useWorkerStore } from '../../store/workerStore';
import { useAuthStore } from '../../store/authStore';
import WorkerCard from '../../components/worker/WorkerCard';
import ResourceMonitor from '../../components/worker/ResourceMonitor';

const WorkerDetail: React.FC = () => {
  const { id: workerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = useAuthStore((state) => state.clientId);
  const { currentWorker, resourceHistory, loading, startWorkerPolling, stopPolling } =
    useWorkerStore();

  useEffect(() => {
    if (!clientId || !workerId) {
      return;
    }

    // 启动轮询，每 3 秒更新一次
    startWorkerPolling(clientId, workerId, 3000);

    // 组件卸载时停止轮询
    return () => {
      stopPolling();
    };
  }, [clientId, workerId, startWorkerPolling, stopPolling]);

  if (loading && !currentWorker) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载 Worker 详情..." />
      </div>
    );
  }

  if (!currentWorker) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Empty description="Worker 不存在" />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/workers')}
          style={{ marginTop: 16 }}
        >
          返回 Worker 列表
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/workers')}
        >
          返回
        </Button>
        <h2 style={{ margin: 0 }}>Worker 详情 - {workerId}</h2>
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <WorkerCard worker={currentWorker} />
        </Col>
        <Col xs={24} lg={24}>
          <ResourceMonitor data={resourceHistory} />
        </Col>
      </Row>
    </div>
  );
};

export default WorkerDetail;
