import React from 'react';
import { Layout, Card } from 'antd';
import { CloudServerOutlined } from '@ant-design/icons';
import './AuthLayout.css';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout className="auth-layout">
      <Content className="auth-content">
        <div className="auth-container">
          <div className="auth-header">
            <CloudServerOutlined className="auth-logo" />
            <h1 className="auth-title">iSelect 分布式计算平台</h1>
            <p className="auth-subtitle">高效、可靠的分布式计算解决方案</p>
          </div>
          <Card className="auth-card" bordered={false}>
            {children}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
