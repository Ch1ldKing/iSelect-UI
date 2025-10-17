import { Layout, Menu, Drawer } from 'antd';
import {
  DashboardOutlined,
  ClusterOutlined,
  FileOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  isMobile?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, isMobile = false, onCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
    // Auto-collapse on mobile after navigation
    if (isMobile && onCollapse) {
      onCollapse(true);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => handleMenuClick('/dashboard'),
    },
    {
      key: '/workers',
      icon: <ClusterOutlined />,
      label: 'Worker',
      onClick: () => handleMenuClick('/workers'),
    },
    {
      key: '/files',
      icon: <FileOutlined />,
      label: '文件',
      onClick: () => handleMenuClick('/files'),
    },
    {
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: '任务',
      onClick: () => handleMenuClick('/tasks'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => handleMenuClick('/settings'),
    },
  ];

  // Get the current selected key based on the pathname
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/workers')) return '/workers';
    if (path.startsWith('/files')) return '/files';
    if (path.startsWith('/tasks')) return '/tasks';
    if (path.startsWith('/settings')) return '/settings';
    return '/dashboard';
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      style={{
        background: '#f6ffed',
        border: 'none',
        marginTop: 16,
      }}
    />
  );

  // Use Drawer for mobile, Sider for desktop
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={() => onCollapse?.(true)}
        open={!collapsed}
        closable={false}
        width={200}
        styles={{
          body: {
            padding: 0,
            background: '#f6ffed',
          },
        }}
      >
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={200}
      style={{
        background: '#f6ffed',
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      {menuContent}
    </Sider>
  );
};

export default Sidebar;
