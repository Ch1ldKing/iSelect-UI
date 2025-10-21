import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { clientService } from '../../api/clientService';
import AuthLayout from '../../layouts/AuthLayout';
import type { RegisterUserData } from '../../types/auth';
import type { Client } from '../../api/clientService';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.getClients();
        // 确保 data 是数组
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('密码长度至少为 8 个字符'));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('密码必须包含至少一个大写字母'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('密码必须包含至少一个小写字母'));
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(new Error('密码必须包含至少一个数字'));
    }
    return Promise.resolve();
  };

  const onFinish = async (values: RegisterUserData) => {
    setLoading(true);
    try {
      await register(values);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ padding: '24px' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#52c41a' }}>
          用户注册
        </Title>
        
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="client_id"
            rules={[
              { required: true, message: '请选择公司' }
            ]}
          >
            <Select
              placeholder="选择公司"
              loading={loadingClients}
              suffixIcon={<BankOutlined style={{ color: '#52c41a' }} />}
              notFoundContent={loadingClients ? '加载中...' : '暂无可用公司'}
            >
              {Array.isArray(clients) && clients.map(client => (
                <Select.Option key={client.client_id} value={client.client_id}>
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#52c41a' }} />}
              placeholder="邮箱"
            />
          </Form.Item>

          <Form.Item
            name="display_name"
            rules={[
              { required: true, message: '请输入显示名称' },
              { whitespace: true, message: '显示名称不能为空' },
              { min: 2, message: '显示名称至少 2 个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              placeholder="显示名称"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { validator: validatePassword }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#52c41a' }} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            dependencies={['password']}
            hasFeedback
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
            <Input.Password
              prefix={<LockOutlined style={{ color: '#52c41a' }} />}
              placeholder="确认密码"
            />
          </Form.Item>

          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              密码要求：至少 8 个字符，包含大小写字母和数字
            </Text>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: '40px' }}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">已有账户？</Text>{' '}
            <Link to="/login" style={{ color: '#52c41a' }}>
              立即登录
            </Link>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Register;
