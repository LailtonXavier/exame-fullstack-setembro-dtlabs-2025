import { z } from 'zod';

export const RegisterHeartbeatSchema = z.object({
  deviceId: z.string().uuid('DeviceId must be a valid UUID'),
  cpuUsage: z.coerce.number().min(0, 'CPU usage is required'),
  ramUsage: z.coerce.number().min(0, 'RAM usage is required'),
  diskFree: z.coerce.number().min(0, 'Disk free is required'),
  temperature: z.coerce.number().min(0, 'Temperature is required'),
  latencyDns: z.coerce.number().int().min(0, 'Latency DNS is required'),
  connectivity: z.preprocess((val) => {
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? 0 : n;
    }
    if (typeof val === 'number') return val;
    return 0;
  }, z.number().min(0).max(1)),
  bootTime: z.coerce.date(),
});

export type RegisterHeartbeatSchemaZod = z.infer<typeof RegisterHeartbeatSchema>;
