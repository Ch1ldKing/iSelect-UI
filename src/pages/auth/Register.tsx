import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from '../../layouts/AuthLayout';
import type { RegisterClientData } from '../../types/auth';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const registerClient = useAuthStore((state) => state.registerClient);

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Promise('请输入密码'));
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

  const onFinish = async (values: RegisterClientData) => {
    setLoading(true);
    try {
      await registerClient(values);
      // 注册成功后自动重定向到仪表盘
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
          公司注册
        </Title>
        
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="client_name"
            rules={[
              { required: true, message: '请输入公司名称' },
              { whitespace: true, message: '公司名称不能为空' },
              { min: 2, message: '公司名称至少 2 个字符' }
            ]}
          >
            <Input
              prefix={<BankOutlined style={{ color: '#52c41a' }} />}
              placeholder="公司名称"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入管理员用户名' },
              { whitespace: true, message: '用户名不能为空' },
              { min: 3, message: '用户名至少 3 个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              placeholder="管理员用户名"
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
