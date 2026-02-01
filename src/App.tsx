import { useEffect, useState, useCallback } from "react";
import { useDeviceStore } from "./stores/deviceStore";
import { useSettingsStore } from "./stores/settingsStore";
import { Header } from "./components/Header";
import { DeviceList } from "./components/DeviceList";
import { Settings } from "./components/Settings";
import { stopAllMirrors } from "./lib/tauri";

const POLLING_INTERVAL = 2000;

function App() {
  const { fetchDevices, fetchActiveMirrors, clearActiveMirrors } = useDeviceStore();
  const { fetchConfig } = useSettingsStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleRefresh = useCallback(() => {
    fetchDevices();
    fetchActiveMirrors();
  }, [fetchDevices, fetchActiveMirrors]);

  // Initial load
  useEffect(() => {
    fetchConfig();
    handleRefresh();
  }, [fetchConfig, handleRefresh]);

  // Device polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDevices();
      fetchActiveMirrors();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchDevices, fetchActiveMirrors]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd+, - Settings
      if (isMod && e.key === ",") {
        e.preventDefault();
        setShowSettings(true);
      }

      // Cmd+R - Refresh
      if (isMod && e.key === "r") {
        e.preventDefault();
        handleRefresh();
      }

      // Cmd+Shift+S - Stop all
      if (isMod && e.shiftKey && e.key === "S") {
        e.preventDefault();
        try {
          await stopAllMirrors();
          clearActiveMirrors();
        } catch (err) {
          console.error("Failed to stop all:", err);
        }
      }

      // Escape - Close settings
      if (e.key === "Escape" && showSettings) {
        setShowSettings(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSettings, handleRefresh, clearActiveMirrors]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllMirrors().catch(console.error);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onRefresh={handleRefresh}
      />

      <main className="flex-1 overflow-y-auto p-4">
        <DeviceList />
      </main>

      <footer className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <p className="text-xs text-[var(--color-text-muted)] text-center">
          Connect Android devices via USB to start mirroring
        </p>
      </footer>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
