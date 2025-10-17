import { useState, useEffect } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

// Breadcrumb mapping for different routes
const breadcrumbNameMap: Record<string, string> = {
  '/dashboard': '仪表盘',
  '/workers': 'Worker 管理',
  '/files': '文件管理',
  '/tasks': '任务管理',
  '/tasks/create': '创建任务',
  '/settings': '设置',
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    
    const breadcrumbItems: Array<{ title: React.ReactNode }> = [
      {
        title: <Link to="/dashboard">首页</Link>,
      },
    ];

    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNameMap[url];
      
      if (name) {
        breadcrumbItems.push({
          title: index === pathSnippets.length - 1 ? <>{name}</> : <Link to={url}>{name}</Link>,
        });
      }
    });

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar collapsed={collapsed} isMobile={isMobile} onCollapse={setCollapsed} />
        <Layout style={{ padding: '0 16px 16px' }}>
          {/* Collapse trigger and breadcrumb */}
          <div
            style={{
              padding: '16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                cursor: 'pointer',
                color: '#389e0d',
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
