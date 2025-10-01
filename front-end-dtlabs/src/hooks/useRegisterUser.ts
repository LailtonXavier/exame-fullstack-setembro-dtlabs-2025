import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RegisterUserDto } from '@/core/domain/types/user-types';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useNavigate } from 'react-router-dom';

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const { register } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterUserDto) => {
      await register(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao criar conta');
    }
  });
}
