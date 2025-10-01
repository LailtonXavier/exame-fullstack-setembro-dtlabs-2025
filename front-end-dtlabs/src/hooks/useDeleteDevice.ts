import { useDeviceStore } from '@/core/infra/store/deviceStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  const { deleteDevice } = useDeviceStore();

  return useMutation({
    mutationFn: async (deviceId: string) => {
      await deleteDevice(deviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/devices'] });
      toast.success('Dispositivo deletado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar um dispositivo');
    }
  });
}
