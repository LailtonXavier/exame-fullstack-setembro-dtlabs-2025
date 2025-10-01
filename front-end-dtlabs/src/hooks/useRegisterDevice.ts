import { RegisterDeviceDto } from '@/core/domain/types/device-types';
import { useDeviceStore } from '@/core/infra/store/deviceStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRegisterDevice() {
  const queryClient = useQueryClient();
  const { registerDevice } = useDeviceStore();

  return useMutation({
    mutationFn: async (data: RegisterDeviceDto) => {
      await registerDevice(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/devices'] });
      toast.success('Dispositivo criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar dispositivo');
    }
  });
}
