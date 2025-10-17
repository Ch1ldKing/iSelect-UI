// 认证状态管理
import { create } from 'zustand';
import { clientService } from '../api/clientService';
import type { LoginCredentials, RegisterClientData } from '../api/clientService';
import { message } from 'antd';

interface AuthState {
  token: string | null;
  clientId: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerClient: (data: RegisterClientData) => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  clientId: null,
  userId: null,
  username: null,
  isAuthenticated: false,

  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await clientService.login(credentials);
      const { token } = response;

      // 存储到 localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('clientId', credentials.client_id);
      localStorage.setItem('username', credentials.username);

      // 更新状态
      set({
        token,
        clientId: credentials.client_id,
        username: credentials.username,
        isAuthenticated: true,
      });

      message.success('登录成功');
    } catch (error) {
      message.error('登录失败，请检查您的凭据');
      throw error;
    }
  },

  /**
   * 用户登出
   */
  logout: () => {
    // 清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    // 重置状态
    set({
      token: null,
      clientId: null,
      userId: null,
      username: null,
      isAuthenticated: false,
    });

    message.info('已登出');
  },

  /**
   * 注册新的公司/机构客户端
   */
  registerClient: async (data: RegisterClientData) => {
    try {
      const response = await clientService.register(data);
      const { token, client_id, user_id } = response;

      // 存储到 localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('clientId', client_id);
      localStorage.setItem('userId', user_id);
      localStorage.setItem('username', data.username);

      // 更新状态
      set({
        token,
        clientId: client_id,
        userId: user_id,
        username: data.username,
        isAuthenticated: true,
      });

      message.success('注册成功');
    } catch (error) {
      message.error('注册失败，请重试');
      throw error;
    }
  },

  /**
   * 初始化认证状态（从 localStorage 恢复）
   */
  initAuth: () => {
    const token = localStorage.getItem('token');
    const clientId = localStorage.getItem('clientId');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token) {
      set({
        token,
        clientId,
        userId,
        username,
        isAuthenticated: true,
      });
    }
  },
}));
