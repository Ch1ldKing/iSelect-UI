// Worker related types

export type WorkerStatus = 'online' | 'offline' | 'busy';

export interface Worker {
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
  status?: WorkerStatus;
  busy?: boolean;
}

export interface WorkerState {
  workers: Worker[];
  onlineCount: number;
  availableCount: number;
  loading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;
  fetchWorkers: () => Promise<void>;
  startPolling: (clientId: string, interval?: number) => void;
  stopPolling: () => void;
}

export interface ResourceData {
  timestamp: string;
  cpu: number;
  memory: number;
  vram: number;
}
