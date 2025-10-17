// Task related types

export type TaskStatus = 'init' | 'assigned' | 'running' | 'success' | 'failure' | 'retrying';
export type SubtaskStatus = 'init' | 'waiting' | 'computing' | 'success' | 'failure';

export interface Subtask {
  subtask_id: string;
  worker_id: string;
  start_index: number;
  end_index: number;
  subtask_status: SubtaskStatus;
  progress: string;
  result?: number[];
  error?: string;
}

export interface Task {
  task_id: string;
  function_id: string;
  user_id: string;
  file_url: string;
  task_status: TaskStatus;
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

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<string>;
  fetchTaskDetail: (taskId: string) => Promise<void>;
  startPolling: (taskId: string, interval?: number) => void;
  stopPolling: () => void;
}
