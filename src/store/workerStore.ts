// Worker 状态管理
import { create } from 'zustand';
import { workerService } from '../api/workerService';
import type { Worker, ResourceData } from '../types/worker';
import { message } from 'antd';

interface WorkerState {
  workers: Worker[];
  currentWorker: Worker | null;
  resourceHistory: ResourceData[];
  onlineCount: number;
  availableCount: number;
  loading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;
  fetchWorkers: () => Promise<void>;
  fetchWorkerDetail: (clientId: string, workerId: string) => Promise<void>;
  startPolling: (interval?: number) => void;
  startWorkerPolling: (clientId: string, workerId: string, interval?: number) => void;
  stopPolling: () => void;
}

/**
 * 判断 Worker 是否在线
 * 如果最后心跳时间在 30 秒内，则认为在线
 */
function isWorkerOnline(lastHeartbeat: string): boolean {
  const now = new Date().getTime();
  const heartbeat = new Date(lastHeartbeat).getTime();
  return now - heartbeat < 30000; // 30 seconds
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  workers: [],
  currentWorker: null,
  resourceHistory: [],
  onlineCount: 0,
  availableCount: 0,
  loading: false,
  pollingInterval: null,

  /**
   * 获取指定客户端的 Worker 列表
   */
  fetchWorkers: async () => {
    set({ loading: true });
    try {
      const response = await workerService.getByClientId();

      // 为每个 Worker 添加状态信息
      const workers: Worker[] = response.workers.map((w) => ({
        ...w,
        status: isWorkerOnline(w.last_heartbeat) ? 'online' : 'offline',
        busy: w.cpu_usage_percent > 80 || w.memory_usage_percent > 80,
      }));

      // 计算在线和可用 Worker 数量
      const onlineCount = workers.filter((w) => w.status === 'online').length;
      const availableCount = workers.filter(
        (w) => w.status === 'online' && !w.busy
      ).length;

      set({ workers, onlineCount, availableCount });
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      // 轮询时不显示错误消息，避免干扰用户
      if (!get().pollingInterval) {
        message.error('获取 Worker 列表失败');
      }
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 启动轮询更新 Worker 数据
   */
  startPolling: (interval = 5000) => {
    const { stopPolling, fetchWorkers } = get();

    // 先停止现有的轮询
    stopPolling();

    // 立即获取一次数据
    fetchWorkers();

    // 启动定时轮询
    const pollingInterval = setInterval(() => {
      fetchWorkers();
    }, interval);

    set({ pollingInterval });
  },

  /**
   * 获取单个 Worker 的详细信息
   */
  fetchWorkerDetail: async (workerId: string) => {
    set({ loading: true });
    try {
      const response = await workerService.getByClientId();

      // 从列表中找到指定的 Worker
      const worker = response.workers.find((w) => w.worker_id === workerId);

      if (worker) {
        const workerWithStatus: Worker = {
          ...worker,
          status: isWorkerOnline(worker.last_heartbeat) ? 'online' : 'offline',
          busy: worker.cpu_usage_percent > 80 || worker.memory_usage_percent > 80,
        };

        // 添加到资源历史记录
        const newResourceData: ResourceData = {
          timestamp: new Date().toISOString(),
          cpu: worker.cpu_usage_percent,
          memory: worker.memory_usage_percent,
          vram: worker.vram_usage_percent,
        };

        set((state) => ({
          currentWorker: workerWithStatus,
          resourceHistory: [...state.resourceHistory, newResourceData].slice(-20), // 保留最近 20 条记录
        }));
      } else {
        message.error('Worker 不存在');
      }
    } catch (error) {
      console.error('Failed to fetch worker detail:', error);
      // 轮询时不显示错误消息
      if (!get().pollingInterval) {
        message.error('获取 Worker 详情失败');
      }
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 启动 Worker 详情页面的轮询
   */
  startWorkerPolling: (clientId: string, workerId: string, interval = 3000) => {
    const { stopPolling, fetchWorkerDetail } = get();

    // 先停止现有的轮询
    stopPolling();

    // 清空历史记录
    set({ resourceHistory: [] });

    // 立即获取一次数据
    fetchWorkerDetail(clientId, workerId);

    // 启动定时轮询
    const pollingInterval = setInterval(() => {
      fetchWorkerDetail(clientId, workerId);
    }, interval);

    set({ pollingInterval });
  },

  /**
   * 停止轮询
   */
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
}));
