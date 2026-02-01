import { create } from "zustand";
import { AppConfig, getConfig, saveSettings as saveSettingsApi } from "../lib/tauri";
import { toast } from "./toastStore";

interface SettingsState {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateSettings: (
    audioEnabled: boolean,
    showTouches: boolean,
    orientation: number,
    resolution: number,
    bitrate: number,
  ) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  config: null,
  isLoading: false,
  error: null,

  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const config = await getConfig();
      set({ config, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
      toast.error("Failed to load settings");
    }
  },

  updateSettings: async (
    audioEnabled: boolean,
    showTouches: boolean,
    orientation: number,
    resolution: number,
    bitrate: number,
  ) => {
    try {
      await saveSettingsApi(audioEnabled, showTouches, orientation, resolution, bitrate);
      const { config } = get();
      if (config) {
        set({
          config: {
            ...config,
            audio_enabled: audioEnabled,
            show_touches: showTouches,
            orientation,
            resolution,
            bitrate,
          },
        });
      }
    } catch (e) {
      set({ error: String(e) });
      toast.error("Failed to save settings");
    }
  },
}));
