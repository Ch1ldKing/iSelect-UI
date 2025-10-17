import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Subtask } from '../../types';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';

const { Text } = Typography;

interface SubtaskTableProps {
  subtasks: Subtask[];
  loading?: boolean;
}

const SubtaskTable: React.FC<SubtaskTableProps> = ({ subtasks, loading = false }) => {
  const columns: ColumnsType<Subtask> = [
    {
      title: '子任务 ID',
      dataIndex: 'subtask_id',
      key: 'subtask_id',
      width: 200,
    },
    {
      title: 'Worker ID',
      dataIndex: 'worker_id',
      key: 'worker_id',
      width: 200,
    },
    {
      title: '数据范围',
      key: 'data_range',
      width: 180,
      render: (_, record) => (
        <Text>{`${record.start_index} - ${record.end_index}`}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'subtask_status',
      key: 'subtask_status',
      width: 120,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (progress: string, record) => {
        const percent = parseFloat(progress.replace('%', ''));
        const getStatus = () => {
          if (record.subtask_status === 'success') return 'success';
          if (record.subtask_status === 'failure') return 'exception';
          return 'active';
        };
        return (
          <ProgressBar
            percent={percent}
            status={getStatus()}
            size="small"
            strokeColor={record.subtask_status === 'failure' ? '#f5222d' : undefined}
          />
        );
      },
    },
    {
      title: '错误信息',
      dataIndex: 'error',
      key: 'error',
      render: (error?: string) => (
        error ? <Text type="danger">{error}</Text> : <Text type="secondary">-</Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={subtasks}
      rowKey="subtask_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 个子任务`,
      }}
      scroll={{ x: 1000 }}
      locale={{
        emptyText: '暂无子任务数据',
      }}
    />
  );
};

export default SubtaskTable;
