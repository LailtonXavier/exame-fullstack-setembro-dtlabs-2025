import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }).min(1, 'Name is required'),
  
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email('Invalid email').min(1, 'Email is required'),
  
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }).min(6, 'Password must be at least 6 characters'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;