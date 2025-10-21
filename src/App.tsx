import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { greenTheme } from './theme';
import { setMessageApi } from './api/client';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Worker pages
import WorkerList from './pages/workers/WorkerList';
import WorkerDetail from './pages/workers/WorkerDetail';

// File pages
import FileManagement from './pages/files/FileManagement';

// Task pages
import TaskList from './pages/tasks/TaskList';
import TaskCreate from './pages/tasks/TaskCreate';
import TaskDetail from './pages/tasks/TaskDetail';

// Settings
import Settings from './pages/settings/Settings';

function AppContent() {
  const { message } = AntApp.useApp();
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // 设置全局 message API
    setMessageApi(message);
    // 初始化认证状态
    initAuth();
  }, [message, initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workers" element={<WorkerList />} />
          <Route path="/workers/:id" element={<WorkerDetail />} />
          <Route path="/files" element={<FileManagement />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<TaskCreate />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ConfigProvider theme={greenTheme}>
      <AntApp>
        <AppContent />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
