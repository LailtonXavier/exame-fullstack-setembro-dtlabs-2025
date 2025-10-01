import { RegisterNotificationDto } from '@/core/domain/types/notification-types';
import { useNotificationStore } from '@/core/infra/store/notificationStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRegisterNotification() {
  const queryClient = useQueryClient();
  const { registerNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (data: RegisterNotificationDto) => {
      await registerNotification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/notifications'] });
      toast.success('Notificação criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar uma notificação');
    }
  });
}
