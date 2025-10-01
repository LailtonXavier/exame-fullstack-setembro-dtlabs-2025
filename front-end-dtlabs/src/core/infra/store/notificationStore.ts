import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { Notification } from '@/core/domain/entities/notification';
import { RegisterNotificationDto } from '@/core/domain/types/notification-types';
import { registerNotification } from '../controllers/notification/registerNotification';

interface NotificationState {
  Notification: Notification | null;
  registerNotification: (data: RegisterNotificationDto) => Promise<void>;
  isLoadingNotification: boolean;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  Notification: null,
  isLoadingNotification: false,

  registerNotification: async (data) => {
    set({ isLoadingNotification: true });
    const { addNotificationInStore } = useAuthStore.getState();

    try {
      const res = await registerNotification(data);
  
      set({ Notification: res });
  
      addNotificationInStore(data.deviceId, res);
    } finally {
      set({ isLoadingNotification: false });
    }
  },

}));
