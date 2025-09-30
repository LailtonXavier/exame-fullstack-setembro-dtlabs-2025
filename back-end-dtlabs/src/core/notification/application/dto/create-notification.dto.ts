import { z } from 'zod';

export const CreateNotificationDto = z.object({
  userId: z.string().uuid('UserId must be a valid UUID'),
  deviceId: z.string().uuid('DeviceId must be a valid UUID'),
  metric: z.enum(['cpuUsage', 'ramUsage', 'diskFree', 'temperature', 'latencyDns']),
  threshold: z.number(),
  condition: z.enum(['>', '<', '==']),
});

export type CreateNotificationDtoType = z.infer<typeof CreateNotificationDto>;
