import { Table, Empty } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T> extends TableProps<T> {
  emptyText?: string;
}

function DataTable<T extends object>({
  emptyText = '暂无数据',
  ...props
}: DataTableProps<T>) {
  return (
    <Table
      {...props}
      locale={{
        emptyText: <Empty description={emptyText} />,
      }}
      pagination={
        props.pagination === false
          ? false
          : {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              ...props.pagination,
            }
      }
      scroll={props.scroll || { x: 'max-content' }}
    />
  );
}

export default DataTable;
