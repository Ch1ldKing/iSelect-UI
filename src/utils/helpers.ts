/**
 * Check if a worker is online based on last heartbeat timestamp
 * A worker is considered online if last heartbeat was within 30 seconds
 */
export function isWorkerOnline(lastHeartbeat: string): boolean {
  const now = new Date().getTime();
  const heartbeat = new Date(lastHeartbeat).getTime();
  return now - heartbeat < 30000; // 30 seconds
}
