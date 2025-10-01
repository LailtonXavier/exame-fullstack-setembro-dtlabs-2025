import { z } from 'zod';

export const UpdateDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
});

export type UpdateDeviceSchemaZod = z.infer<typeof UpdateDeviceSchema>;