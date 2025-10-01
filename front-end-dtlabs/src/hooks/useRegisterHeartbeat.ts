import { RegisterHeartbeatDto } from '@/core/domain/types/heartbeat-types';
import { useHeartbeatStore } from '@/core/infra/store/heartbeatStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRegisterHeartbeat() {
  const queryClient = useQueryClient();
  const { registerHeartbeat } = useHeartbeatStore();

  return useMutation({
    mutationFn: async (data: RegisterHeartbeatDto) => {
      await registerHeartbeat(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/heartbeats'] });
      toast.success('Heartbeat criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar um Heartbeat');
    }
  });
}
