import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterNotificationSchema } from '@/shared/utils/registerNotificationSchema';

export const useRegisterNotificationForm = () => {
  const methods = useForm({
    resolver: zodResolver(RegisterNotificationSchema),
    mode: 'onChange'
  });

  return {
    ...methods,
    register: methods.register,
    handleSubmit: methods.handleSubmit,
    setValue: methods.setValue,
    clearErrors: methods.clearErrors,
    errors: methods.formState.errors,
  };
};
