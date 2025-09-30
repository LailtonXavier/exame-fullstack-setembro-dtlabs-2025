import { z } from 'zod';

export const CreateHeartbeatDto = z.object({
  deviceId: z.string().uuid('DeviceId must be a valid UUID'),
  cpuUsage: z.number().min(0, 'CPU usage is required'),
  ramUsage: z.number().min(0, 'RAM usage is required'),
  diskFree: z.number().min(0, 'Disk free is required'),
  temperature: z.number().min(0, 'Temperature is required'),
  latencyDns: z.number().int().min(0, 'Latency DNS is required'),
  connectivity: z.enum(['0', '1']).transform(Number),
  bootTime: z.coerce.date(),
});

export type CreateHeartbeatDtoType = z.infer<typeof CreateHeartbeatDto>;
