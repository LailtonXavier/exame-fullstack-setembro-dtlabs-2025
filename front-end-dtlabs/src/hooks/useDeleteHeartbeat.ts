import { useHeartbeatStore } from '@/core/infra/store/heartbeatStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteHeartbeat() {
  const queryClient = useQueryClient();
  const { deleteHeartbeat } = useHeartbeatStore();

  return useMutation({
    mutationFn: async (heartbeatId: string) => {
      await deleteHeartbeat(heartbeatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/heartbeat'] });
      toast.success('Heartbeat deletado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar um heartbeat');
    }
  });
}
