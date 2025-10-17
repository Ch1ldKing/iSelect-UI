// Worker 相关 API 服务
import { apiClient } from './client';

export interface WorkerStatus {
  worker_id: string;
  client_id: string;
  cpu_cores: number;
  cpu_frequency_ghz: number;
  memory_gb: number;
  vram_gb: number;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  vram_usage_percent: number;
  last_heartbeat: string;
}

export interface WorkerStatusListResponse {
  success: boolean;
  workers: WorkerStatus[];
}

export interface WorkerStatusByClientResponse {
  success: boolean;
  client_id: string;
  workers: WorkerStatus[];
  count: number;
}

export const workerService = {
  /**
   * 获取所有 Worker 状态
   */
  getAll: async (): Promise<WorkerStatusListResponse> => {
    const response = await apiClient.get<WorkerStatusListResponse>('/workers/status');
    return response.data;
  },

  /**
   * 获取指定客户端的 Worker 状态
   */
  getByClientId: async (): Promise<WorkerStatusByClientResponse> => {
    const response = await apiClient.get<WorkerStatusByClientResponse>(`/workers/status`);
    return response.data;
  },
};
