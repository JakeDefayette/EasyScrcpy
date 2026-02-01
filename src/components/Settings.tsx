import { useState } from "react";
import { useSettingsStore } from "../stores/settingsStore";
import { WifiSetup } from "./WifiSetup";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { config, updateSettings } = useSettingsStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAudioToggle = async () => {
    if (!config) return;
    await updateSettings(!config.audio_enabled, config.show_touches);
  };

  const handleTouchesToggle = async () => {
    if (!config) return;
    await updateSettings(config.audio_enabled, !config.show_touches);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[var(--color-text-muted)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Audio Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Audio forwarding</p>
              <p className="text-xs text-[var(--color-text-muted)]">Requires Android 11+</p>
            </div>
            <button
              onClick={handleAudioToggle}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config?.audio_enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  config?.audio_enabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Touch Indicators Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Touch indicators</p>
              <p className="text-xs text-[var(--color-text-muted)]">Show touch points on screen</p>
            </div>
            <button
              onClick={handleTouchesToggle}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config?.show_touches ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  config?.show_touches ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Advanced Section */}
          <div className="pt-2 border-t border-[var(--color-border)]">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <span>Advanced</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showAdvanced && <WifiSetup />}
          </div>
        </div>
      </div>
    </div>
  );
}
