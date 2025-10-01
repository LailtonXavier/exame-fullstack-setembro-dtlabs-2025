import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/shared/utils/registerSchema';

export const useRegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
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