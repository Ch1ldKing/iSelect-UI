// 任务相关 API 服务
import { apiClient } from './client';

export interface Subtask {
  subtask_id: string;
  worker_id: string;
  start_index: number;
  end_index: number;
  subtask_status: 'init' | 'waiting' | 'computing' | 'success' | 'failure';
  progress: string;
  result?: number[];
  error?: string;
}

export interface Task {
  task_id: string;
  function_id: string;
  user_id: string;
  file_url: string;
  task_status: 'init' | 'assigned' | 'running' | 'success' | 'failure' | 'retrying';
  subtask_list: Subtask[];
  retry_times: number;
  current_round: number;
  max_rounds: number;
  task_volume: number;
  result?: string;
  created_at: string;
  completed_at?: string;
}

export interface CreateTaskData {
  function_id: string;
}

export interface ExecuteTaskResponse {
  success: boolean;
  message: string;
  task_id: string;
}

export interface TaskStatusResponse {
  success: boolean;
  message: string;
  task: Task;
}

export const taskService = {
  /**
   * 创建并执行新任务
   */
  execute: async (data: CreateTaskData): Promise<ExecuteTaskResponse> => {
    const response = await apiClient.post<ExecuteTaskResponse>('/task/execute', data);
    return response.data;
  },

  /**
   * 获取任务状态
   */
  getStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await apiClient.get<TaskStatusResponse>(`/task/status/${taskId}`);
    return response.data;
  },

  /**
   * 获取所有任务列表（如果后端支持）
   */
  getAll: async (): Promise<{ success: boolean; tasks: Task[] }> => {
    // 注意：此接口可能需要根据实际后端 API 调整
    const response = await apiClient.get<{ success: boolean; tasks: Task[] }>('/tasks');
    return response.data;
  },
};
