export type DomainUserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type ReturnUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  devices: {
    uuid: string;
    name: string;
    location: string;
    sn: string;
    description: string | null;
    userId: string;
    created_at: Date;
    updated_at: Date;
    heartbeats: {
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
    }[];
    notifications: {
      id: string;
      userId: string;
      deviceId: string;
      metric: string;
      threshold: number;
      condition: string;
      createdAt: Date;
    }[];
  }[];
};
