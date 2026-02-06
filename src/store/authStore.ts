// 认证状态管理
import { create } from 'zustand';
import { clientService } from '../api/clientService';
import type { LoginCredentials, RegisterUserData } from '../api/clientService';
import { getMessageApi } from '../api/client';
import { tokenStorage } from '../utils/cookies';

interface AuthState {
  token: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterUserData) => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  displayName: null,
  isAuthenticated: false,

  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials) => {
    const response = await clientService.login(credentials);
    const { token, display_name } = response;

    // 同时存储到 localStorage 和 Cookie（主站和 iSelect 共享）
    tokenStorage.setToken(token, display_name);

    // 更新状态
    set({
      token,
      displayName: display_name,
      isAuthenticated: true,
    });

    getMessageApi().success('登录成功');
  },

  /**
   * 用户登出
   */
  logout: () => {
    // 同时清除 localStorage 和 Cookie
    tokenStorage.clear();

    // 重置状态
    set({
      token: null,
      displayName: null,
      isAuthenticated: false,
    });

    getMessageApi().info('已登出');
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterUserData) => {
    const response = await clientService.register(data);
    const { token } = response;

    // 同时存储到 localStorage 和 Cookie（主站和 iSelect 共享）
    tokenStorage.setToken(token, data.display_name);

    // 更新状态
    set({
      token,
      displayName: data.display_name,
      isAuthenticated: true,
    });

    getMessageApi().success('注册成功');
  },

  /**
   * 初始化认证状态（优先从 Cookie 恢复，其次从 localStorage）
   */
  initAuth: () => {
    const token = tokenStorage.getToken();
    const displayName = tokenStorage.getDisplayName();

    if (token) {
      set({
        token,
        displayName,
        isAuthenticated: true,
      });
    }
  },
}));
