import { create } from 'zustand';
import { login } from '../controllers/auth/login';
import { LoginDto, RegisterUserDto } from '@/core/domain/types/user-types';
import { User } from '@/core/domain/entities/user';
import { getUser } from '../controllers/user/getUser';
import { registerUser } from '../controllers/auth/registerUser';
import { tokenStore } from './tokenStore';
import { Device } from '@/core/domain/entities/device';
import { UpdateDeviceDto } from '@/core/domain/types/device-types';
import { Heartbeat } from '@/core/domain/entities/heartbeat';
import { Notification } from '@/core/domain/entities/notification';

interface AuthState {
  user: User | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterUserDto) => Promise<void>;
  isLoading: boolean;
  loadUserFromToken: () => Promise<void>;
  addDevice: (device: Device) => void;
  updateDeviceInStore: (deviceId: string, updateDeviceInStore: UpdateDeviceDto) => void;
  deleteDeviceInStore: (deviceId: string) => void;
  addHeartbeat: (deviceId: string, heartbeat: Heartbeat) => void;
  deleteHeartbeatInStore: (heartbeatId: string) => void;
  addNotificationInStore: (deviceId: string, notification: Notification) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (data) => {
    set({ isLoading: true });
    try {
      const token = await login(data);
      if (token) {
        const user = await getUser();
        set({ user });
        await tokenStore.saveTokens(token);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await registerUser(data);
      if (res.tokens) {
        set({ user: res.user });
        await tokenStore.saveTokens(res.tokens);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  loadUserFromToken: async () => {
    set({ isLoading: true });
    try {
      const token = await tokenStore.getAccessToken();
      if (token) {
        const user = await getUser();
        set({ user });
      }
    } catch {
      await tokenStore.clearTokens();
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  addDevice: (device) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, devices: [device, ...(state.user.devices ?? [])] }
        : null,
    })
  ),

  updateDeviceInStore: (deviceId: string, updatedDevice: UpdateDeviceDto) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            devices: state.user.devices
              ? state.user.devices.map((d) =>
                  d.uuid === deviceId ? { ...d, ...updatedDevice } : d
                )
              : [],
          }
        : null,
    })
  ),

  deleteDeviceInStore: (deviceId: string) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            devices: state.user.devices
              ? state.user.devices.filter((d) => d.uuid !== deviceId)
              : [],
          }
        : null,
    })
  ),

  addHeartbeat: (deviceId, heartbeat) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            devices: state.user.devices
              ? state.user.devices.map((d) =>
                  d.uuid === deviceId
                    ? {
                        ...d,
                        heartbeats: [heartbeat, ...(d.heartbeats ?? [])],
                      }
                    : d
                )
              : [],
          }
        : null,
    })
  ),

  deleteHeartbeatInStore: (heartbeatId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            devices: state.user.devices
              ? state.user.devices.map((d) => ({
                  ...d,
                  heartbeats: d.heartbeats
                    ? d.heartbeats.filter((h) => h.id !== heartbeatId)
                    : [],
                }))
              : [],
          }
        : null,
    })
  ),

  addNotificationInStore: (deviceId, notification) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            devices: state.user.devices
              ? state.user.devices.map((d) =>
                  d.uuid === deviceId
                    ? {
                        ...d,
                        notifications: [notification, ...(d.notifications ?? [])],
                      }
                    : d
                )
              : [],
          }
        : null,
    })),
  
}));
