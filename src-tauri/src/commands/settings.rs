use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppConfig {
    pub device_labels: HashMap<String, String>,
    #[serde(default = "default_audio_enabled")]
    pub audio_enabled: bool,
    #[serde(default = "default_show_touches")]
    pub show_touches: bool,
    #[serde(default = "default_orientation")]
    pub orientation: u8,
    #[serde(default = "default_resolution")]
    pub resolution: u16,
    #[serde(default = "default_bitrate")]
    pub bitrate: u32,
    #[serde(default)]
    pub wifi_devices: Vec<WifiDevice>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WifiDevice {
    pub ip: String,
    pub port: u16,
    pub label: Option<String>,
}

fn default_audio_enabled() -> bool {
    true
}

fn default_show_touches() -> bool {
    true
}

fn default_orientation() -> u8 {
    1 // Landscape (90° clockwise from portrait)
}

fn default_resolution() -> u16 {
    1920 // Default max resolution
}

fn default_bitrate() -> u32 {
    8_000_000 // 8 Mbps default
}

fn get_config_path() -> Result<PathBuf, String> {
    let config_dir =
        dirs::config_dir().ok_or_else(|| "Could not determine config directory".to_string())?;
    let app_config_dir = config_dir.join("EasyScrcpy");
    fs::create_dir_all(&app_config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    Ok(app_config_dir.join("config.json"))
}

pub fn load_config() -> Result<AppConfig, String> {
    let config_path = get_config_path()?;
    if !config_path.exists() {
        return Ok(AppConfig::default());
    }
    let content =
        fs::read_to_string(&config_path).map_err(|e| format!("Failed to read config: {}", e))?;
    serde_json::from_str(&content).map_err(|e| format!("Failed to parse config: {}", e))
}

fn save_config(config: &AppConfig) -> Result<(), String> {
    let config_path = get_config_path()?;
    let content = serde_json::to_string_pretty(config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    fs::write(&config_path, content).map_err(|e| format!("Failed to write config: {}", e))
}

#[tauri::command]
pub fn get_config() -> Result<AppConfig, String> {
    load_config()
}

#[tauri::command]
pub fn save_device_label(serial: String, label: String) -> Result<(), String> {
    let mut config = load_config().unwrap_or_default();
    if label.is_empty() {
        config.device_labels.remove(&serial);
    } else {
        config.device_labels.insert(serial, label);
    }
    save_config(&config)
}

#[tauri::command]
pub fn save_settings(
    audio_enabled: bool,
    show_touches: bool,
    orientation: u8,
    resolution: u16,
    bitrate: u32,
) -> Result<(), String> {
    let mut config = load_config().unwrap_or_default();
    config.audio_enabled = audio_enabled;
    config.show_touches = show_touches;
    config.orientation = orientation;
    config.resolution = resolution;
    config.bitrate = bitrate;
    save_config(&config)
}
