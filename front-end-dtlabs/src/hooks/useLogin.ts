import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginDto } from '@/core/domain/types/user-types';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      await login(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao fazer login');
    }
  });
}
