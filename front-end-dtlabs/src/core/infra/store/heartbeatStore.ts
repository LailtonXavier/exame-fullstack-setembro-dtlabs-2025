import { Heartbeat } from '@/core/domain/entities/heartbeat';
import { getHeartbeatProps, RegisterHeartbeatDto } from '@/core/domain/types/heartbeat-types';
import { create } from 'zustand';
import { deleteHeartbeat } from '../controllers/heartbeat/deleteDevice';
import { registerHeartbeat } from '../controllers/heartbeat/registerHeartbeat';
import { useAuthStore } from './authStore';
import { getHeartbeat } from '../controllers/heartbeat/getHeartbeat';

interface HeartbeatState {
  heartbeat: Heartbeat | null;
  heartbeatFiltered: Heartbeat[] | null;
  registerHeartbeat: (data: RegisterHeartbeatDto) => Promise<void>;
  getHeartbeat: (data: getHeartbeatProps) => Promise<void>;
  heartbeatClean: () => Promise<void>;
  deleteHeartbeat: (heartbeatId: string) => Promise<void>;
  isLoadingHeartbeat: boolean;
}

export const useHeartbeatStore = create<HeartbeatState>((set) => ({
  heartbeat: null,
  heartbeatFiltered: null,
  isLoadingHeartbeat: false,

  registerHeartbeat: async (data) => {
    set({ isLoadingHeartbeat: true });
    const { addHeartbeat } = useAuthStore.getState();

    try {
      const res = await registerHeartbeat(data);
  
      set({ heartbeat: res });
  
      addHeartbeat(data.deviceId, res);
    } finally {
      set({ isLoadingHeartbeat: false });
    }
  }, 
  
  getHeartbeat: async (data) => {
    set({ isLoadingHeartbeat: true });

    try {
      const res = await getHeartbeat(data);
  
      set({ heartbeatFiltered: res });
  
    } finally {
      set({ isLoadingHeartbeat: false });
    }
  },

  heartbeatClean: async () => {
    set({ isLoadingHeartbeat: true });

    try {
      set({ heartbeatFiltered: [] });
  
    } finally {
      set({ isLoadingHeartbeat: false });
    }
  },

  deleteHeartbeat: async (heartbeatId) => {
    set({ isLoadingHeartbeat: true });
    const { deleteHeartbeatInStore } = useAuthStore.getState();

    try {
      await deleteHeartbeat(heartbeatId);
  
      deleteHeartbeatInStore(heartbeatId)
    } finally {
      set({ isLoadingHeartbeat: false });
    }
  },
  
}));
