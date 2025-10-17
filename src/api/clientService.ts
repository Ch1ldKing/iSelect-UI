// 认证相关 API 服务
import { apiClient } from './client';

export interface RegisterClientData {
  client_name: string;
  username: string;
  password: string;
}

export interface RegisterClientResponse {
  success: boolean;
  message: string;
  token: string;
  client_id: string;
  user_id: string;
}

export interface RegisterUserData {
  client_id: string;
  username: string;
  password: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  token: string;
  user_id: string;
}

export interface LoginCredentials {
  client_id: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export const clientService = {
  /**
   * 注册新的公司/机构客户端
   */
  register: async (data: RegisterClientData): Promise<RegisterClientResponse> => {
    const response = await apiClient.post<RegisterClientResponse>('/client/register', data);
    return response.data;
  },

  /**
   * 在已有客户端下注册新用户
   */
  registerUser: async (data: RegisterUserData): Promise<RegisterUserResponse> => {
    const response = await apiClient.post<RegisterUserResponse>('/user/register', data);
    return response.data;
  },

  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/user/login', credentials);
    return response.data;
  },
};
