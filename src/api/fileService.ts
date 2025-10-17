// 文件相关 API 服务
import { apiClient } from './client';

export interface FileInfo {
  file_id: string;
  file_name: string;
  file_size: number;
  file_url: string;
  uploaded_at: string;
  user_id: string;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  file_id: string;
  file_url: string;
}

export const fileService = {
  /**
   * 上传文件
   * 后端会从 token 中自动解析用户信息
   */
  upload: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadFileResponse>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 获取文件列表
   * 后端会从 token 中自动解析用户信息，无需传参
   */
  getAll: async (): Promise<{ success: boolean; files: FileInfo[] }> => {
    const response = await apiClient.get<{ success: boolean; files: FileInfo[] }>('/files');
    return response.data;
  },

  /**
   * 删除文件
   * 后端会从 token 中自动解析用户信息
   */
  delete: async (fileId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/files/${fileId}`
    );
    return response.data;
  },
};
