// API 客户端配置
import axios from 'axios';
import { message as antdMessage } from 'antd';
import { getCookie } from '../utils/cookies';

// 创建 Axios 实例
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// 全局 message 实例（用于在拦截器中显示消息）
let messageApi: any = null;

export const setMessageApi = (api: any) => {
  messageApi = api;
};

// 获取 message API，如果没有设置则使用静态方法
const getMessage = () => messageApi || antdMessage;

// 导出 message API 供其他模块使用
export const getMessageApi = () => getMessage();

// 请求拦截器 - 添加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // 优先从 Cookie 获取 token（支持跨应用共享），其次从 localStorage
    const token = getCookie('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getMessage();
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      message.error('请求超时，请检查网络连接后重试');
      return Promise.reject(error);
    }

    if (error.response) {
      // 服务器返回错误响应
      const { status, data, config } = error.response;
      
      // 判断是否是登录或注册请求
      const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/register');
      
      switch (status) {
        case 401:
          if (isAuthRequest) {
            // 登录/注册失败，统一显示中文错误
            message.error('邮箱或密码错误');
          } else {
            // token 过期，清除认证信息并重定向
            localStorage.clear();
            // 同时清除 Cookie
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.adbiza.com';
            document.cookie = 'displayName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.adbiza.com';
            window.location.href = '/iselect/login';
            message.error('登录已过期，请重新登录');
          }
          break;
        case 400:
          // 显示后端返回的错误消息
          message.error(data?.message || '请求参数错误，请检查输入');
          break;
        case 403:
          message.error('没有权限执行此操作');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 409:
          message.error(data?.message || '资源冲突，请检查后重试');
          break;
        case 422:
          message.error(data?.message || '数据验证失败');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        case 502:
          message.error('网关错误，请稍后重试');
          break;
        case 503:
          message.error('服务暂时不可用，请稍后重试');
          break;
        default:
          message.error(data?.message || '发生未知错误，请稍后重试');
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应（网络错误）
      message.error('网络连接失败，请检查您的网络连接');
    } else {
      // 请求配置出错
      message.error('请求失败，请稍后重试');
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
