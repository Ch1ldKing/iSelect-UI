import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import UserManagement from '../../components/settings/UserManagement';

const Settings: React.FC = () => {
  const items = [
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          用户管理
        </span>
      ),
      children: <UserManagement />,
    },
    {
      key: 'system',
      label: (
        <span>
          <SettingOutlined />
          系统设置
        </span>
      ),
      children: (
        <div style={{ padding: '24px' }}>
          <p>系统设置功能即将推出...</p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="users" items={items} />
    </div>
  );
};

export default Settings;
