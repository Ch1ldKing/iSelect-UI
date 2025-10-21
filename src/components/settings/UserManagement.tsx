import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Card } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { clientService } from '../../api/clientService';
import { useAuthStore } from '../../store/authStore';
import { validatePassword } from '../../utils/validators';

const UserManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: { client_id: string; email: string; display_name: string; password: string }) => {
    setLoading(true);
    try {
      await clientService.register({
        client_id: values.client_id,
        email: values.email,
        display_name: values.display_name,
        password: values.password,
      });

      message.success('用户注册成功！');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      // 显示更详细的错误信息
      const errorMessage = error?.response?.data?.message || '用户注册失败，请检查邮箱是否已存在或稍后重试';
      message.error(errorMessage);
      console.error('User registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="用户管理" bordered={false}>
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={showModal}
      >
        添加新用户
      </Button>

      <Modal
        title="添加新用户"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="显示名称"
            name="display_name"
            rules={[
              { required: true, message: '请输入显示名称' },
              { min: 2, message: '显示名称至少2个字符' },
            ]}
          >
            <Input placeholder="请输入显示名称" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const result = validatePassword(value);
                  if (!result.valid) {
                    return Promise.reject(new Error(result.message));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册用户
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement;
