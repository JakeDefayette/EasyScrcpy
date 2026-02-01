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
    <div className="mt-4 space-y-4">
      <div>
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
          WiFi Connection
        </p>

        {usbDevices.length > 0 ? (
          <div className="space-y-2">
            {usbDevices.map((device) => (
              <div
                key={device.serial}
                className="flex items-center justify-between p-2 bg-[var(--color-bg-tertiary)] rounded-md"
              >
                <span className="text-xs text-[var(--color-text-primary)] truncate">
                  {device.label || device.model || device.serial}
                </span>
                <button
                  onClick={() => handleEnableWifi(device.serial)}
                  disabled={enablingSerial === device.serial}
                  className="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
                >
                  {enablingSerial === device.serial ? "Enabling..." : "Enable WiFi"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">
            Connect a device via USB to enable WiFi mode
          </p>
        )}
      </div>

      {wifiResult && (
        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-md">
          <p className="text-xs text-[var(--color-success)] mb-2">WiFi mode enabled</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded">
              {wifiResult.ip}:{wifiResult.port}
            </code>
            <button
              onClick={() => handleConnect(wifiResult.ip, wifiResult.port)}
              disabled={connecting}
              className="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            You can now disconnect the USB cable
          </p>
        </div>
      )}

      <div>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          Or connect to a known device:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            placeholder="192.168.1.x:5555"
            className="flex-1 px-2 py-1.5 text-xs bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
            onKeyDown={(e) => e.key === "Enter" && handleManualConnect()}
          />
          <button
            onClick={handleManualConnect}
            disabled={connecting || !manualIp.trim()}
            className="text-xs px-3 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded hover:border-[var(--color-border-hover)] disabled:opacity-50 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
