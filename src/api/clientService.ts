// 认证相关 API 服务
import { apiClient } from './client';

export interface Client {
  client_id: string;
  name: string;
  website?: string;
  entity_number?: string;
  description?: string;
  created_at: string;
}

export interface RegisterUserData {
  client_id: string;
  email: string;
  display_name: string;
  password: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  token: string;
  user_id: string;
  client_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user_id: string;
  client_id: string;
  display_name: string;
}

export const clientService = {
  /**
   * 获取客户端列表
   */
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get<{ success: boolean; clients: Client[] }>('/clients');
    return response.data.clients || [];
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterUserData): Promise<RegisterUserResponse> => {
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
