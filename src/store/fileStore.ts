// 文件状态管理
import { create } from 'zustand';
import { fileService } from '../api/fileService';
import type { FileInfo } from '../types/file';
import { message } from 'antd';

interface FileState {
  files: FileInfo[];
  loading: boolean;
  uploadFile: (file: File) => Promise<void>;
  fetchFiles: () => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  loading: false,

  /**
   * 上传文件
   * 后端会从 token 中自动解析用户信息
   */
  uploadFile: async (file: File) => {
    set({ loading: true });
    try {
      await fileService.upload(file);
      message.success('文件上传成功');

      // 上传成功后重新从后端获取文件列表
      await useFileStore.getState().fetchFiles();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '文件上传失败';
      message.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 获取文件列表
   * 后端会从 token 中自动解析用户信息
   */
  fetchFiles: async () => {
    set({ loading: true });
    try {
      const response = await fileService.getAll();
      set({ files: Array.isArray(response.files) ? response.files : [] });
    } catch (error) {
      console.error('Failed to fetch files:', error);
      message.error('获取文件列表失败');
      set({ files: [] });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 删除文件
   * 后端会从 token 中自动解析用户信息
   */
  deleteFile: async (fileId: string) => {
    set({ loading: true });
    try {
      await fileService.delete(fileId);
      message.success('文件删除成功');
      
      // 删除成功后重新从后端获取文件列表
      await useFileStore.getState().fetchFiles();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '文件删除失败';
      message.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
