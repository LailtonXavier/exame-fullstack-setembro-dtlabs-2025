import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/shared/utils/loginSchema';

export const useLoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange'
  });

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    register
  };
};