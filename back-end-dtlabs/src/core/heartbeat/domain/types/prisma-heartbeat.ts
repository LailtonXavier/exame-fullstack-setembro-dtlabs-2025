export type DomainHeartbeatProps = {
  id: string;
  deviceId: string;
  cpuUsage: number;
  ramUsage: number;
  diskFree: number;
  temperature: number;
  latencyDns: number;
  connectivity: number;
  bootTime: Date;
  createdAt: Date;
}