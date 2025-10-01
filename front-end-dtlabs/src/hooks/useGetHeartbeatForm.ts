import { GetHeartbeatSchema } from '@/shared/utils/getHeartbeatSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useGetHeartbeatForm = () => {
  const methods = useForm({
    resolver: zodResolver(GetHeartbeatSchema),
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
