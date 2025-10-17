import React, { useState } from 'react';
import { Table, Button, Modal, Space, Typography, message, App } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FileInfo } from '../../types/file';
import { formatFileSize, formatDateTime } from '../../utils/format';

const { Text } = Typography;

interface FileListProps {
  files: FileInfo[];
  loading?: boolean;
  onDelete?: (fileId: string) => Promise<void>;
}

const FileList: React.FC<FileListProps> = ({ files, loading = false, onDelete }) => {
  const { modal } = App.useApp();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewFileName, setPreviewFileName] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  /**
   * 预览 CSV 文件（显示前 100 行）
   */
  const handlePreview = async (file: FileInfo) => {
    const loadingMessage = message.loading('正在加载文件预览...', 0);
    try {
      // 从文件 URL 获取文件内容
      const response = await fetch(file.file_url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      // 获取前 100 行
      const lines = text.split('\n').slice(0, 100);
      const preview = lines.join('\n');
      
      setPreviewFileName(file.file_name);
      setPreviewContent(preview);
      setPreviewVisible(true);
      loadingMessage();
    } catch (error) {
      loadingMessage();
      console.error('Failed to preview file:', error);
      message.error('无法加载文件内容，请检查文件是否存在或稍后重试');
    }
  };

  /**
   * 下载文件
   */
  const handleDownload = (file: FileInfo) => {
    try {
      // 创建一个隐藏的 a 标签触发下载
      const link = document.createElement('a');
      link.href = file.file_url;
      link.download = file.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('文件下载已开始');
    } catch (error) {
      message.error('文件下载失败');
      console.error('Download error:', error);
    }
  };

  /**
   * 删除文件（带确认）
   */
  const handleDelete = (file: FileInfo) => {

    
    modal.confirm({
      title: '确认删除文件',
      content: `确定要删除文件 "${file.file_name}" 吗？删除后无法恢复。`,
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        
        if (!onDelete) {
          message.error('删除功能未配置');
          return;
        }

        setDeleting(true);
        try {
          await onDelete(file.file_id);
        } catch (error) {
          console.error('Delete file error:', error);
          // 错误消息已在 store 中处理
        } finally {
          setDeleting(false);
        }
      },
      onCancel: () => {
        console.log('Modal cancelled');
      },
    });
  };

  const columns: ColumnsType<FileInfo> = [
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name',
      ellipsis: true,
      width: 300,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '上传时间',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      render: (_, record: FileInfo) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={deleting}
            disabled={deleting}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={files}
        rowKey="file_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个文件`,
        }}
        scroll={{ x: 800 }}
        locale={{
          emptyText: '暂无文件',
        }}
      />

      <Modal
        title={`预览文件: ${previewFileName}`}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <pre
          style={{
            maxHeight: '500px',
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: '1.5',
          }}
        >
          {previewContent}
        </pre>
        <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
          注意：仅显示文件前 100 行
        </Text>
      </Modal>
    </>
  );
};

export default FileList;
