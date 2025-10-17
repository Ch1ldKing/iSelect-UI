import { Table, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Worker } from '../../types/worker';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';

interface WorkerTableProps {
  workers: Worker[];
  loading: boolean;
}

const WorkerTable: React.FC<WorkerTableProps> = ({ workers, loading }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<Worker> = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Worker ID',
      dataIndex: 'worker_id',
      key: 'worker_id',
      width: 200,
    },
    {
      title: 'CPU 使用率',
      dataIndex: 'cpu_usage_percent',
      key: 'cpu_usage_percent',
      width: 200,
      render: (percent: number) => (
        <ProgressBar
          percent={percent}
          strokeColor={percent > 80 ? '#faad14' : undefined}
        />
      ),
    },
    {
      title: '内存使用率',
      dataIndex: 'memory_usage_percent',
      key: 'memory_usage_percent',
      width: 200,
      render: (percent: number) => <ProgressBar percent={percent} />,
    },
    {
      title: '显存使用率',
      dataIndex: 'vram_usage_percent',
      key: 'vram_usage_percent',
      width: 200,
      render: (percent: number) => <ProgressBar percent={percent} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/workers/${record.worker_id}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={workers}
      loading={loading}
      rowKey="worker_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 个 Worker`,
      }}
      scroll={{ x: 1000 }}
      locale={{
        emptyText: '暂无 Worker 数据',
      }}
    />
  );
};

export default WorkerTable;
