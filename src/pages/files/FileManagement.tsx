import React, { useEffect } from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import FileUpload from '../../components/file/FileUpload';
import FileList from '../../components/file/FileList';
import { useFileStore } from '../../store/fileStore';

const { Title } = Typography;

const FileManagement: React.FC = () => {
  const { files, loading, fetchFiles, deleteFile } = useFileStore();

  // 页面加载时获取文件列表
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 上传成功后刷新文件列表（已在 uploadFile 中自动调用，这里可选）
  const handleUploadSuccess = () => {
    // 可选：如果需要额外的操作可以在这里添加
  };

  // 删除文件
  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题 */}
        <div>
          <Title level={2}>文件管理</Title>
          <Typography.Text type="secondary">
            上传和管理您的 CSV 数据文件
          </Typography.Text>
        </div>

        {/* 文件上传区域 */}
        <Card title="上传文件">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </Card>

        <Divider />

        {/* 文件列表区域 */}
        <Card title="文件列表">
          <FileList files={files} loading={loading} onDelete={handleDelete} />
        </Card>
      </Space>
    </div>
  );
};

export default FileManagement;
