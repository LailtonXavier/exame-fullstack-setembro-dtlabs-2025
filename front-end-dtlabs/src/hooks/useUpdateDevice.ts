import { UpdateDeviceDto } from '@/core/domain/types/device-types';
import { useDeviceStore } from '@/core/infra/store/deviceStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface useUpdateDeviceProps {
  deviceId: string;
  data: UpdateDeviceDto;
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  const { updateDevice } = useDeviceStore();

  return useMutation({
    mutationFn: async ({deviceId ,data}: useUpdateDeviceProps) => {
      await updateDevice(deviceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/devices'] });
      toast.success('Dispositivo atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar dispositivo');
    }
  });
}
