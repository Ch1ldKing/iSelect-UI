import { useEffect, useState } from 'react';
import { Card, Form, Select, Button, InputNumber, Space, Alert, Spin } from 'antd';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { useFileStore } from '../../store/fileStore';
import { formatFileSize, formatDateTime } from '../../utils/format';

const { Option } = Select;

const TaskCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createTask } = useTaskStore();
  const { files, loading: fileLoading, fetchFiles } = useFileStore();
  const [submitting, setSubmitting] = useState(false);

  // 算法选项（根据实际后端支持的算法配置）
  const algorithmOptions = [
    { value: 'algorithm-001', label: '逻辑回归 (Logistic Regression)' },
    { value: 'algorithm-002', label: '线性回归 (Linear Regression)' },
    { value: 'algorithm-003', label: '神经网络 (Neural Network)' },
    { value: 'algorithm-004', label: 'K-均值聚类 (K-Means)' },
  ];

  // 组件挂载时获取文件列表
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const taskId = await createTask({
        function_id: values.function_id,
      });

      // 任务创建成功，导航到任务详情页面
      navigate(`/tasks/${taskId}`);
    } catch (error) {
      // 错误已在 store 中处理
      console.error('Failed to create task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 返回任务列表
  const handleBack = () => {
    navigate('/tasks');
  };

  // 检查是否可以提交
  const selectedFunctionId = Form.useWatch('function_id', form);
  const selectedFileId = Form.useWatch('file_id', form);
  const canSubmit = selectedFunctionId && selectedFileId && !submitting;

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="创建任务"
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
        }
      >
        {/* 提示信息 */}
        <Alert
          message="创建计算任务"
          description="选择算法和数据文件来创建一个新的分布式计算任务。任务将自动分配给可用的 Worker 节点执行。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* 文件加载状态 */}
        {fileLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="加载文件列表..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              task_volume: 1000,
            }}
          >
            {/* 算法选择 */}
            <Form.Item
              name="function_id"
              label="选择算法"
              rules={[{ required: true, message: '请选择要执行的算法' }]}
              tooltip="选择要在分布式系统上执行的算法"
            >
              <Select
                placeholder="请选择算法"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {algorithmOptions.map((algo) => (
                  <Option key={algo.value} value={algo.value}>
                    {algo.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 文件选择 */}
            <Form.Item
              name="file_id"
              label="选择数据文件"
              rules={[{ required: true, message: '请选择数据文件' }]}
              tooltip="选择已上传的 CSV 数据文件"
            >
              <Select
                placeholder={
                  files.length === 0
                    ? '暂无可用文件，请先上传文件'
                    : '请选择数据文件'
                }
                size="large"
                showSearch
                optionFilterProp="children"
                disabled={files.length === 0}
              >
                {files.map((file) => (
                  <Option key={file.file_id} value={file.file_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{file.file_name}</span>
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        {formatFileSize(file.file_size)} · {formatDateTime(file.uploaded_at)}
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 任务参数配置 */}
            <Form.Item
              name="task_volume"
              label="任务数据量"
              rules={[
                { required: true, message: '请输入任务数据量' },
                { type: 'number', min: 1, message: '数据量必须大于 0' },
              ]}
              tooltip="指定要处理的数据行数"
            >
              <InputNumber
                placeholder="请输入数据量"
                size="large"
                style={{ width: '100%' }}
                min={1}
                step={100}
              />
            </Form.Item>

            {/* 无文件提示 */}
            {files.length === 0 && (
              <Alert
                message="没有可用的数据文件"
                description={
                  <span>
                    您还没有上传任何数据文件。请先前往{' '}
                    <a onClick={() => navigate('/files')}>文件管理</a> 页面上传 CSV 文件。
                  </span>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 提交按钮 */}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  size="large"
                  loading={submitting}
                  disabled={!canSubmit}
                >
                  创建任务
                </Button>
                <Button size="large" onClick={handleBack}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default TaskCreate;
