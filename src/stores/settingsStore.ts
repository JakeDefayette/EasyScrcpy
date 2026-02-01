import { create } from "zustand";
import { AppConfig, getConfig, saveSettings as saveSettingsApi } from "../lib/tauri";

interface SettingsState {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateSettings: (audioEnabled: boolean, showTouches: boolean) => Promise<void>;
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
    }
  },

  updateSettings: async (audioEnabled: boolean, showTouches: boolean) => {
    try {
      await saveSettingsApi(audioEnabled, showTouches);
      const { config } = get();
      if (config) {
        set({
          config: {
            ...config,
            audio_enabled: audioEnabled,
            show_touches: showTouches,
          },
        });
      }
    } catch (e) {
      set({ error: String(e) });
    }
  },
}));
