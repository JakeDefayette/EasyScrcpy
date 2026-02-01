import { useState } from "react";
import { Device, startMirror, stopMirror, saveDeviceLabel } from "../lib/tauri";
import { useDeviceStore } from "../stores/deviceStore";
import { useSettingsStore } from "../stores/settingsStore";
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
      console.error("Failed to start mirror:", e);
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
      console.error("Failed to stop mirror:", e);
    } finally {
      setIsStopping(false);
    }
  };

  const handleSaveLabel = async (label: string) => {
    try {
      await saveDeviceLabel(device.serial, label);
      await fetchDevices();
    } catch (e) {
      console.error("Failed to save label:", e);
    }
    setShowLabelModal(false);
  };

  const statusColor = {
    device: "bg-[var(--color-success)]",
    offline: "bg-[var(--color-text-muted)]",
    unauthorized: "bg-[var(--color-warning)]",
    unknown: "bg-[var(--color-text-muted)]",
  }[device.status];

  const statusText = {
    device: "Connected",
    offline: "Offline",
    unauthorized: "Unauthorized",
    unknown: "Unknown",
  }[device.status];

  return (
    <>
      <div
        className={`
          group flex items-center gap-3 p-3 rounded-lg border transition-colors
          ${isActive
            ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30"
            : "bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
          }
        `}
      >
        {/* Connection type icon */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)]">
          {device.connection_type === "wifi" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 12.728M5.636 5.636L18.364 18.364M5.636 5.636L3 3m15.364 15.364l2.636 2.636M12 9v2m0 4h.01" />
            </svg>
          )}
        </div>

        {/* Device info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {displayName}
            </span>
            <button
              onClick={() => setShowLabelModal(true)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--color-bg-tertiary)] transition-opacity"
              title="Edit label"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-[var(--color-text-muted)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            <span className="text-xs text-[var(--color-text-muted)]">{statusText}</span>
            {device.model && device.label && (
              <span className="text-xs text-[var(--color-text-muted)]">· {device.model}</span>
            )}
          </div>
        </div>

        {/* Action button */}
        {isActive ? (
          <button
            onClick={handleStop}
            disabled={isStopping}
            className="flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] disabled:opacity-50 transition-colors"
          >
            {isStopping ? "Stopping..." : "Stop"}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={!isOnline || isStarting}
            className="flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStarting ? "Starting..." : "Start"}
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
