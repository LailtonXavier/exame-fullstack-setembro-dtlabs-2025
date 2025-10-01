export type RegisterHeartbeatDto = {
	deviceId: string;
  cpuUsage: number;
  ramUsage:number;
  diskFree: number;
  temperature: number;
  latencyDns: number;
  connectivity: string;
  bootTime: Date;
}

export type getHeartbeatProps = {
  deviceId: string;
  from: string;
  to: string;
}
