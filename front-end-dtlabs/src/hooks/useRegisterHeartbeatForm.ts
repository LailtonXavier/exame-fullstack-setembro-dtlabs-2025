import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterHeartbeatSchema } from '@/shared/utils/registerHeartbeatSchema';

export const useRegisterHeartbeatForm = () => {
  const methods = useForm({
    resolver: zodResolver(RegisterHeartbeatSchema),
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
