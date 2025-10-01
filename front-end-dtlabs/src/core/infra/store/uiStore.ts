import { create } from "zustand";
import { Device } from "@/core/domain/entities/device";

interface UiState {
  deviceModal: boolean;
  selectedDevice: Device | null;
  openDeviceModal: (device?: Device) => void;
  closeDeviceModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  deviceModal: false,
  selectedDevice: null,
  openDeviceModal: (device) =>
    set({ deviceModal: true, selectedDevice: device ?? null }),
  closeDeviceModal: () => set({ deviceModal: false, selectedDevice: null }),
}));
