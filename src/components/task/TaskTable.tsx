import { Table, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Task } from '../../types/task';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/format';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, loading }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<Task> = [
    {
      title: '任务 ID',
      dataIndex: 'task_id',
      key: 'task_id',
      width: 200,
      ellipsis: true,
    },
    {
      title: '算法名称',
      dataIndex: 'function_id',
      key: 'function_id',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'task_status',
      key: 'task_status',
      width: 120,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/tasks/${record.task_id}`)}
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
      dataSource={tasks}
      loading={loading}
      rowKey="task_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 800 }}
      locale={{
        emptyText: '暂无任务数据',
      }}
    />
  );
};

export default TaskTable;
