import { Device } from '@/core/domain/entities/device';
import { RegisterDeviceDto, UpdateDeviceDto } from '@/core/domain/types/device-types';
import { create } from 'zustand';
import { registerDevice } from '../controllers/device/registerDevice';
import { useAuthStore } from './authStore';
import { updateDevice } from '../controllers/device/updateDevice';
import { deleteDevice } from '../controllers/device/deleteDevice';

interface DeviceState {
  device: Device | null;
  registerDevice: (data: RegisterDeviceDto) => Promise<void>;
  updateDevice: (deviceId: string, data: UpdateDeviceDto) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;
  isLoadingDevice: boolean;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  device: null,
  isLoadingDevice: false,

  registerDevice: async (data) => {
    set({ isLoadingDevice: true });
    const { addDevice } = useAuthStore.getState();

    try {
      const res = await registerDevice(data);
  
      set({ device: res });
  
      addDevice(res);
    } finally {
      set({ isLoadingDevice: false });
    }
  },

  updateDevice: async (deviceId, data) => {
    set({ isLoadingDevice: true });
    const { updateDeviceInStore } = useAuthStore.getState();

    try {
      const res = await updateDevice(deviceId, data);
  
      set({ device: res });

      updateDeviceInStore(deviceId, res)
    } finally {
      set({ isLoadingDevice: false });
    }
  }, 
  
  deleteDevice: async (deviceId) => {
    set({ isLoadingDevice: true });
    const { deleteDeviceInStore } = useAuthStore.getState();

    try {
      await deleteDevice(deviceId);
  
      deleteDeviceInStore(deviceId)
    } finally {
      set({ isLoadingDevice: false });
    }
  },
  
}));
