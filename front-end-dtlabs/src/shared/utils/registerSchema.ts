import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  email: z.string().min(1, "Campo obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type RegisterSchemaZod = z.infer<typeof RegisterSchema>;