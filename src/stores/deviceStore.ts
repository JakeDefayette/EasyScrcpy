import { create } from "zustand";
import { Device, getDevices, getActiveMirrors } from "../lib/tauri";

interface DeviceState {
  devices: Device[];
  activeMirrors: Set<string>;
  isLoading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  fetchActiveMirrors: () => Promise<void>;
  addActiveMirror: (serial: string) => void;
  removeActiveMirror: (serial: string) => void;
  clearActiveMirrors: () => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  activeMirrors: new Set(),
  isLoading: false,
  error: null,

  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const devices = await getDevices();
      set({ devices, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  fetchActiveMirrors: async () => {
    try {
      const mirrors = await getActiveMirrors();
      set({ activeMirrors: new Set(mirrors) });
    } catch (e) {
      console.error("Failed to fetch active mirrors:", e);
    }
  },

  addActiveMirror: (serial: string) => {
    const { activeMirrors } = get();
    const newSet = new Set(activeMirrors);
    newSet.add(serial);
    set({ activeMirrors: newSet });
  },

  removeActiveMirror: (serial: string) => {
    const { activeMirrors } = get();
    const newSet = new Set(activeMirrors);
    newSet.delete(serial);
    set({ activeMirrors: newSet });
  },

  clearActiveMirrors: () => {
    set({ activeMirrors: new Set() });
  },
}));
