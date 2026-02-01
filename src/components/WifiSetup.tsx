import { useState } from "react";
import { useDeviceStore } from "../stores/deviceStore";
import { enableWifiMode, connectWifiDevice } from "../lib/tauri";

export function WifiSetup() {
  const { devices, fetchDevices } = useDeviceStore();
  const [enablingSerial, setEnablingSerial] = useState<string | null>(null);
  const [wifiResult, setWifiResult] = useState<{ ip: string; port: number } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [manualIp, setManualIp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const usbDevices = devices.filter(
    (d) => d.connection_type === "usb" && d.status === "device"
  );

  const handleEnableWifi = async (serial: string) => {
    setEnablingSerial(serial);
    setError(null);
    try {
      const result = await enableWifiMode(serial);
      setWifiResult(result);
    } catch (e) {
      setError(String(e));
    } finally {
      setEnablingSerial(null);
    }
  };

  const handleConnect = async (ip: string, port: number) => {
    setConnecting(true);
    setError(null);
    try {
      await connectWifiDevice(ip, port);
      await fetchDevices();
      setWifiResult(null);
      setManualIp("");
    } catch (e) {
      setError(String(e));
    } finally {
      setConnecting(false);
    }
  };

  const handleManualConnect = async () => {
    const ip = manualIp.trim();
    if (!ip) return;

    const [host, portStr] = ip.includes(":") ? ip.split(":") : [ip, "5555"];
    const port = parseInt(portStr, 10) || 5555;

    await handleConnect(host, port);
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[var(--color-bg-tertiary)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-[var(--color-text-muted)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
          </svg>
        </div>
        <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">WiFi Connection</span>
      </div>

      {/* USB devices for WiFi enabling */}
      {usbDevices.length > 0 ? (
        <div className="space-y-1.5">
          {usbDevices.map((device) => (
            <div
              key={device.serial}
              className="flex items-center justify-between p-2.5 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-subtle)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[var(--color-text-muted)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span className="text-[11px] text-[var(--color-text-primary)] truncate">
                  {device.label || device.model || device.serial}
                </span>
              </div>
              <button
                onClick={() => handleEnableWifi(device.serial)}
                disabled={enablingSerial === device.serial}
                className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 bg-[var(--color-accent)] text-white rounded-md hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-all"
              >
                {enablingSerial === device.serial ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enabling
                  </span>
                ) : "Enable WiFi"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-dashed border-[var(--color-border)]">
          <p className="text-[10px] text-[var(--color-text-muted)] text-center">
            Connect a device via USB to enable WiFi mode
          </p>
        </div>
      )}

      {/* WiFi enabled result */}
      {wifiResult && (
        <div className="p-3 rounded-lg bg-[var(--color-success-muted)] border border-[var(--color-success)]/30 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-success)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-medium text-[var(--color-success)]">WiFi mode enabled</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <code className="flex-1 text-[11px] text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] px-2 py-1.5 rounded-md font-mono border border-[var(--color-border)]">
              {wifiResult.ip}:{wifiResult.port}
            </code>
            <button
              onClick={() => handleConnect(wifiResult.ip, wifiResult.port)}
              disabled={connecting}
              className="text-[10px] font-medium px-2.5 py-1.5 bg-[var(--color-accent)] text-white rounded-md hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-all"
            >
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
          <p className="text-[10px] text-[var(--color-success)]/70">
            You can now disconnect the USB cable
          </p>
        </div>
      )}

      {/* Manual connection */}
      <div className="space-y-2">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Or connect to a known device:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            placeholder="192.168.1.x:5555"
            className="flex-1 px-2.5 py-1.5 text-[11px] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] font-mono transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleManualConnect()}
          />
          <button
            onClick={handleManualConnect}
            disabled={connecting || !manualIp.trim()}
            className="text-[10px] font-medium px-3 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)] disabled:opacity-50 transition-all"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--color-error-muted)] border border-[var(--color-error)]/30 animate-slide-up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-[10px] text-[var(--color-error)] leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
