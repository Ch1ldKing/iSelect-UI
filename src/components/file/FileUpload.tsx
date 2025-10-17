import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useFileStore } from '../../store/fileStore';
import { validateFileType, validateFileSize } from '../../utils/validators';

const { Dragger } = Upload;

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const uploadFile = useFileStore((state) => state.uploadFile);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    showUploadList: true,
    fileList: fileList,
    beforeUpload: (file) => {
      // 验证文件类型（仅 CSV）
      const isCSV = validateFileType(file, ['.csv', 'text/csv', 'application/vnd.ms-excel']);
      if (!isCSV) {
        message.error('只允许上传 CSV 文件');
        return Upload.LIST_IGNORE;
      }

      // 验证文件大小（最大 100MB）
      const isValidSize = validateFileSize(file, 100);
      if (!isValidSize) {
        message.error('文件大小不能超过 100MB');
        return Upload.LIST_IGNORE;
      }

      return true; // 允许上传，触发 customRequest
    },
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      setUploading(true);

      try {
        // 模拟上传进度
        onProgress?.({ percent: 30 });

        // 后端会从 token 中自动解析用户信息
        await uploadFile(file as File);

        onProgress?.({ percent: 100 });
        onSuccess?.(file);

        // 上传成功后清除文件列表
        setFileList([]);

        // 调用成功回调
        onUploadSuccess?.();
      } catch (error) {
        console.error('Upload error:', error);
        onError?.(error as Error);
      } finally {
        setUploading(false);
      }
    },
    onChange: (info) => {
      const { file, fileList: newFileList } = info;
      
      // 更新文件列表状态
      setFileList(newFileList);
      
      if (file.status === 'error') {
        message.error(`${file.name} 文件上传失败`);
      }
    },
  };

  return (
    <Dragger {...uploadProps} disabled={uploading}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">
        仅支持 CSV 格式文件，单个文件大小不超过 100MB
      </p>
    </Dragger>
  );
};

export default FileUpload;
