import { getHeartbeatProps } from '@/core/domain/types/heartbeat-types';
import { useHeartbeatStore } from '@/core/infra/store/heartbeatStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useGetHeartbeat() {
  const queryClient = useQueryClient();
  const { getHeartbeat } = useHeartbeatStore()

  return useMutation({
    mutationFn: async (data: getHeartbeatProps) => {
      await getHeartbeat(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/heartbeats'] });
    },
    onError: () => {
      toast.error('Erro ao criar conta');
    }
  });
}
