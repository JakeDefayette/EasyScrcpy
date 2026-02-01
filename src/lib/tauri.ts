import { invoke } from "@tauri-apps/api/core";

export interface Device {
  serial: string;
  model: string | null;
  status: "device" | "offline" | "unauthorized" | "unknown";
  label: string | null;
  connection_type: "usb" | "wifi";
}

export interface AppConfig {
  device_labels: Record<string, string>;
  audio_enabled: boolean;
  show_touches: boolean;
  orientation: number;
  resolution: number;
  bitrate: number;
  wifi_devices: WifiDevice[];
}

export interface WifiDevice {
  ip: string;
  port: number;
  label: string | null;
}

export interface MirrorOptions {
  serial: string;
  label: string | null;
  audio: boolean;
  show_touches: boolean;
  orientation: number;
  resolution: number;
  bitrate: number;
}

export interface WifiModeResult {
  ip: string;
  port: number;
}

export async function getDevices(): Promise<Device[]> {
  return invoke<Device[]>("get_devices");
}

export async function startMirror(options: MirrorOptions): Promise<number> {
  return invoke<number>("start_mirror", { options });
}

export async function stopMirror(serial: string): Promise<void> {
  return invoke<void>("stop_mirror", { serial });
}

export async function stopAllMirrors(): Promise<void> {
  return invoke<void>("stop_all_mirrors");
}

export async function getActiveMirrors(): Promise<string[]> {
  return invoke<string[]>("get_active_mirrors");
}

export async function getConfig(): Promise<AppConfig> {
  return invoke<AppConfig>("get_config");
}

export async function saveDeviceLabel(serial: string, label: string): Promise<void> {
  return invoke<void>("save_device_label", { serial, label });
}

export async function saveSettings(
  audioEnabled: boolean,
  showTouches: boolean,
  orientation: number,
  resolution: number,
  bitrate: number,
): Promise<void> {
  return invoke<void>("save_settings", { audioEnabled, showTouches, orientation, resolution, bitrate });
}

export async function enableWifiMode(serial: string): Promise<WifiModeResult> {
  return invoke<WifiModeResult>("enable_wifi_mode", { serial });
}

export async function connectWifiDevice(ip: string, port: number): Promise<void> {
  return invoke<void>("connect_wifi_device", { ip, port });
}
