import { z } from 'zod';
import { validateRequiredField } from '@/shared/utils/validation.utils';

export const UpdateDeviceDto = z.object({
  name: z.string().min(2).transform(val => validateRequiredField('name', val)).optional(),
  location: z.string().transform(val => validateRequiredField('location', val)).optional(),
  sn: z.string().min(12).transform(val => validateRequiredField('password', val)).optional(),
  description: z.string().optional(),
});

export type UpdateDeviceDtoType = z.infer<typeof UpdateDeviceDto>;
