import { useState } from "react";
import { useSettingsStore } from "../stores/settingsStore";
import { WifiSetup } from "./WifiSetup";

interface SettingsProps {
  onClose: () => void;
}

const ORIENTATION_OPTIONS = [
  { value: 0, label: "Portrait", icon: "M12 18.375a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" },
  { value: 1, label: "Landscape", icon: "M4.5 18.75a4.5 4.5 0 004.5-4.5v-1.125a4.5 4.5 0 00-4.5-4.5h-1.125a4.5 4.5 0 00-4.5 4.5v1.125a4.5 4.5 0 004.5 4.5H4.5zm0-2.25h-1.125a2.25 2.25 0 01-2.25-2.25v-1.125a2.25 2.25 0 012.25-2.25H4.5a2.25 2.25 0 012.25 2.25v1.125a2.25 2.25 0 01-2.25 2.25zM15 18.75a4.5 4.5 0 004.5-4.5v-1.125a4.5 4.5 0 00-4.5-4.5h-1.125a4.5 4.5 0 00-4.5 4.5v1.125a4.5 4.5 0 004.5 4.5H15zm0-2.25h-1.125a2.25 2.25 0 01-2.25-2.25v-1.125a2.25 2.25 0 012.25-2.25H15a2.25 2.25 0 012.25 2.25v1.125a2.25 2.25 0 01-2.25 2.25z" },
  { value: 3, label: "Reverse Landscape", icon: "M21 18.75a4.5 4.5 0 01-4.5-4.5v-1.125a4.5 4.5 0 014.5-4.5h1.125a4.5 4.5 0 014.5 4.5v1.125a4.5 4.5 0 01-4.5 4.5H21zm0-2.25h1.125a2.25 2.25 0 002.25-2.25v-1.125a2.25 2.25 0 00-2.25-2.25H21a2.25 2.25 0 00-2.25 2.25v1.125a2.25 2.25 0 002.25 2.25zM10.5 18.75a4.5 4.5 0 01-4.5-4.5v-1.125a4.5 4.5 0 014.5-4.5h1.125a4.5 4.5 0 014.5 4.5v1.125a4.5 4.5 0 01-4.5 4.5H10.5zm0-2.25h1.125a2.25 2.25 0 002.25-2.25v-1.125a2.25 2.25 0 00-2.25-2.25H10.5a2.25 2.25 0 00-2.25 2.25v1.125a2.25 2.25 0 002.25 2.25z" },
];

const RESOLUTION_OPTIONS = [
  { value: 1280, label: "720p (HD)" },
  { value: 1920, label: "1080p (FHD)" },
  { value: 2560, label: "1440p (QHD)" },
  { value: 3840, label: "4K (UHD)" },
];

const BITRATE_OPTIONS = [
  { value: 2_000_000, label: "2 Mbps" },
  { value: 4_000_000, label: "4 Mbps" },
  { value: 8_000_000, label: "8 Mbps" },
  { value: 16_000_000, label: "16 Mbps" },
];

export function Settings({ onClose }: SettingsProps) {
  const { config, updateSettings } = useSettingsStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAudioToggle = async () => {
    if (!config) return;
    await updateSettings(
      !config.audio_enabled,
      config.show_touches,
      config.orientation,
      config.resolution,
      config.bitrate,
    );
  };

  const handleTouchesToggle = async () => {
    if (!config) return;
    await updateSettings(
      config.audio_enabled,
      !config.show_touches,
      config.orientation,
      config.resolution,
      config.bitrate,
    );
  };

  const handleOrientationChange = async (orientation: number) => {
    if (!config) return;
    await updateSettings(
      config.audio_enabled,
      config.show_touches,
      orientation,
      config.resolution,
      config.bitrate,
    );
  };

  const handleResolutionChange = async (resolution: number) => {
    if (!config) return;
    await updateSettings(
      config.audio_enabled,
      config.show_touches,
      config.orientation,
      resolution,
      config.bitrate,
    );
  };

  const handleBitrateChange = async (bitrate: number) => {
    if (!config) return;
    await updateSettings(
      config.audio_enabled,
      config.show_touches,
      config.orientation,
      config.resolution,
      bitrate,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-1">
          {/* Audio Toggle */}
          <div className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-text-muted)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--color-text-primary)]">Audio forwarding</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Requires Android 11+</p>
              </div>
            </div>
            <button
              onClick={handleAudioToggle}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                config?.audio_enabled
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  config?.audio_enabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Touch Indicators Toggle */}
          <div className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-text-muted)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--color-text-primary)]">Touch indicators</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Show touch points on screen</p>
              </div>
            </div>
            <button
              onClick={handleTouchesToggle}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                config?.show_touches
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  config?.show_touches ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Orientation Section */}
          <div className="pt-3 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-text-muted)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--color-text-primary)]">Orientation</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Default screen rotation</p>
              </div>
            </div>
            <div className="flex gap-2 px-2">
              {ORIENTATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOrientationChange(option.value)}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                    config?.orientation === option.value
                      ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "bg-[var(--color-bg-tertiary)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                  </svg>
                  <span className="text-[10px] font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="pt-3 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-text-muted)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.048 4.025a3 3 0 01-4.872 3.432 2.25 2.25 0 00-.75-.158H3.96a2.25 2.25 0 01-2.052-1.336l-1.107-2.48a1.5 1.5 0 011.27-2.155h4.505a2.25 2.25 0 012.052 1.336l.473 1.06a3 3 0 003.388 1.621zm7.878-7.878a3 3 0 00-3.388-1.621m5.048 4.025a3 3 0 014.872 3.432 2.25 2.25 0 00.75.158h1.156a2.25 2.25 0 012.052 1.336l1.107 2.48a1.5 1.5 0 01-1.27 2.155h-4.505a2.25 2.25 0 01-2.052-1.336l-.473-1.06a3 3 0 00-3.388-1.621z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--color-text-primary)]">Quality</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Resolution & bitrate</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <div>
                <label className="block text-[10px] font-medium text-[var(--color-text-muted)] mb-1">Resolution</label>
                <select
                  value={config?.resolution ?? 1920}
                  onChange={(e) => handleResolutionChange(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-[12px] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                >
                  {RESOLUTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[var(--color-text-muted)] mb-1">Bitrate</label>
                <select
                  value={config?.bitrate ?? 8_000_000}
                  onChange={(e) => handleBitrateChange(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-[12px] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                >
                  {BITRATE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Section */}
        <div className="border-t border-[var(--color-border-subtle)]">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full px-4 py-3 text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
          >
            <span>Advanced</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="px-4 pb-4 animate-slide-down">
              <WifiSetup />
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="px-4 py-2.5 bg-[var(--color-bg-tertiary)]/50 border-t border-[var(--color-border-subtle)]">
          <p className="text-[10px] text-[var(--color-text-muted)] text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] font-mono text-[9px]">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
