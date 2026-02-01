import { useState } from "react";
import { Device, startMirror, stopMirror, saveDeviceLabel } from "../lib/tauri";
import { useDeviceStore } from "../stores/deviceStore";
import { useSettingsStore } from "../stores/settingsStore";
import { toast } from "../stores/toastStore";
import { EditLabelModal } from "./EditLabelModal";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { activeMirrors, addActiveMirror, removeActiveMirror, fetchDevices } = useDeviceStore();
  const { config } = useSettingsStore();
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  const isActive = activeMirrors.has(device.serial);
  const isOnline = device.status === "device";
  const displayName = device.label || device.model || device.serial;

  const handleStart = async () => {
    if (!isOnline) return;
    setIsStarting(true);
    try {
      await startMirror({
        serial: device.serial,
        label: device.label || device.model || device.serial,
        audio: config?.audio_enabled ?? true,
        show_touches: config?.show_touches ?? true,
      });
      addActiveMirror(device.serial);
    } catch (e) {
      toast.error(`Failed to start mirror for ${displayName}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await stopMirror(device.serial);
      removeActiveMirror(device.serial);
    } catch (e) {
      toast.error(`Failed to stop mirror for ${displayName}`);
    } finally {
      setIsStopping(false);
    }
  };

  const handleSaveLabel = async (label: string) => {
    try {
      await saveDeviceLabel(device.serial, label);
      await fetchDevices();
      toast.success("Label saved");
    } catch (e) {
      toast.error("Failed to save device label");
    }
    setShowLabelModal(false);
  };

  const statusConfig = {
    device: {
      color: "bg-[var(--color-success)]",
      text: "Connected",
      textColor: "text-[var(--color-success)]",
    },
    offline: {
      color: "bg-[var(--color-text-muted)]",
      text: "Offline",
      textColor: "text-[var(--color-text-muted)]",
    },
    unauthorized: {
      color: "bg-[var(--color-warning)]",
      text: "Unauthorized",
      textColor: "text-[var(--color-warning)]",
    },
    unknown: {
      color: "bg-[var(--color-text-muted)]",
      text: "Unknown",
      textColor: "text-[var(--color-text-muted)]",
    },
  }[device.status];

  return (
    <>
      <div
        className={`
          group relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover-lift
          ${isActive
            ? "bg-[var(--color-accent-glow)] border-[var(--color-accent)]/40 glow-accent"
            : "bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)]"
          }
        `}
      >
        {/* Connection type indicator */}
        <div
          className={`
            flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors
            ${isActive
              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
              : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-bg-elevated)]"
            }
          `}
        >
          {device.connection_type === "wifi" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>

        {/* Device info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[13px] font-medium truncate ${isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-primary)]"}`}>
              {displayName}
            </span>
            <button
              onClick={() => setShowLabelModal(true)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--color-bg-elevated)] transition-all"
              title="Edit label"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[var(--color-text-muted)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} />
              <span className={`text-[11px] ${statusConfig.textColor}`}>{statusConfig.text}</span>
            </div>
            {device.model && device.label && (
              <>
                <span className="text-[var(--color-text-muted)]">·</span>
                <span className="text-[11px] text-[var(--color-text-muted)] font-mono truncate">
                  {device.model}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action button */}
        {isActive ? (
          <button
            onClick={handleStop}
            disabled={isStopping}
            className="flex-shrink-0 px-3 py-1.5 text-[12px] font-medium rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)] disabled:opacity-50 transition-all"
          >
            {isStopping ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Stopping
              </span>
            ) : "Stop"}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={!isOnline || isStarting}
            className="flex-shrink-0 px-3 py-1.5 text-[12px] font-medium rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isStarting ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Starting
              </span>
            ) : "Start"}
          </button>
        )}
      </div>

      {showLabelModal && (
        <EditLabelModal
          currentLabel={device.label || ""}
          deviceName={device.model || device.serial}
          onSave={handleSaveLabel}
          onClose={() => setShowLabelModal(false)}
        />
      )}
    </>
  );
}
