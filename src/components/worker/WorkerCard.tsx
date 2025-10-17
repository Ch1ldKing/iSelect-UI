import { Card, Descriptions } from 'antd';
import type { Worker } from '../../types/worker';
import StatusBadge from '../common/StatusBadge';

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  return (
    <Card
      title="Worker 基本信息"
      bordered
      style={{
        borderColor: '#b7eb8f',
      }}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Worker ID" span={2}>
          {worker.worker_id}
        </Descriptions.Item>
        <Descriptions.Item label="当前状态">
          <StatusBadge status={worker.status || 'offline'} />
        </Descriptions.Item>
        <Descriptions.Item label="所属客户端">
          {worker.client_id}
        </Descriptions.Item>
        <Descriptions.Item label="CPU 核心数">
          {worker.cpu_cores} 核
        </Descriptions.Item>
        <Descriptions.Item label="CPU 频率">
          {worker.cpu_frequency_ghz} GHz
        </Descriptions.Item>
        <Descriptions.Item label="内存大小">
          {worker.memory_gb} GB
        </Descriptions.Item>
        <Descriptions.Item label="显存大小">
          {worker.vram_gb} GB
        </Descriptions.Item>
        <Descriptions.Item label="最后心跳时间" span={2}>
          {new Date(worker.last_heartbeat).toLocaleString('zh-CN')}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default WorkerCard;
