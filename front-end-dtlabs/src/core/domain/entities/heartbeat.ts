export interface Heartbeat {
  id: string;
  deviceId: string;
  cpuUsage: number;
  ramUsage: number;
  diskFree: number;
  temperature: number;
  latencyDns: number;
  connectivity: number;
  bootTime: string;
  createdAt: string;
}