// 节点相关类型定义
export interface Node {
  id: string;
  name: string;
  status: 'online' | 'offline';
  cpuUsage: number;
  memoryUsage: number;
}
