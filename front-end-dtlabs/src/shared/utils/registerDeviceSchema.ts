import { z } from 'zod';

export const RegisterDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  location: z.string().min(1, 'Location is required'),
  sn: z.string().min(12, 'Serial number must be 12 characters'),
  description: z.string().optional(),
});

export type RegisterDeviceSchemaZod = z.infer<typeof RegisterDeviceSchema>;