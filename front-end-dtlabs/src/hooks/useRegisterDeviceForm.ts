import { RegisterDeviceSchema } from '@/shared/utils/registerDeviceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useRegisterDeviceForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(RegisterDeviceSchema),
    mode: 'onChange'
  });

  return {
    control,
    handleSubmit,
    errors,
    clearErrors,
    setValue,
    watch,
    reset,
    register
  };
};