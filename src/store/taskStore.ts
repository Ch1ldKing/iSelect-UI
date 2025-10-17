// 任务状态管理
import { create } from 'zustand';
import { taskService } from '../api/taskService';
import type { Task, CreateTaskData } from '../types/task';
import { message } from 'antd';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;
  fetchTasks: (silent?: boolean) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<string>;
  fetchTaskDetail: (taskId: string) => Promise<void>;
  startPolling: (taskId: string, interval?: number) => void;
  stopPolling: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  pollingInterval: null,

  /**
   * 获取所有任务列表
   * @param silent - 静默模式，不显示加载状态（用于轮询）
   */
  fetchTasks: async (silent = false) => {
    if (!silent) {
      set({ loading: true });
    }
    try {
      const response = await taskService.getAll();
      set({ tasks: response.tasks });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // 轮询时不显示错误消息，避免干扰用户
      if (!silent) {
        message.error('获取任务列表失败');
      }
    } finally {
      if (!silent) {
        set({ loading: false });
      }
    }
  },

  /**
   * 创建新任务
   */
  createTask: async (data: CreateTaskData) => {
    set({ loading: true });
    try {
      const response = await taskService.execute(data);
      message.success('任务创建成功');
      return response.task_id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '任务创建失败';
      message.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 获取任务详情
   */
  fetchTaskDetail: async (taskId: string) => {
    set({ loading: true });
    try {
      const response = await taskService.getStatus(taskId);
      set({ currentTask: response.task });
    } catch (error) {
      console.error('Failed to fetch task detail:', error);
      // 轮询时不显示错误消息，避免干扰用户
      if (!get().pollingInterval) {
        message.error('获取任务详情失败');
      }
    } finally {
      set({ loading: false });
    }
  },

  /**
   * 启动轮询更新任务状态
   */
  startPolling: (taskId: string, interval = 3000) => {
    const { stopPolling, fetchTaskDetail } = get();

    // 先停止现有的轮询
    stopPolling();

    // 立即获取一次数据
    fetchTaskDetail(taskId);

    // 启动定时轮询
    const pollingInterval = setInterval(() => {
      fetchTaskDetail(taskId);

      // 如果任务已完成（成功或失败），停止轮询
      const { currentTask } = get();
      if (
        currentTask &&
        (currentTask.task_status === 'success' || currentTask.task_status === 'failure')
      ) {
        stopPolling();
      }
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
