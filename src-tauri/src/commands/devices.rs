use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

use super::settings;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Device {
    pub serial: String,
    pub model: Option<String>,
    pub status: DeviceStatus,
    pub label: Option<String>,
    pub connection_type: ConnectionType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum DeviceStatus {
    Device,
    Offline,
    Unauthorized,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ConnectionType {
    Usb,
    Wifi,
}

impl std::fmt::Display for DeviceStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DeviceStatus::Device => write!(f, "device"),
            DeviceStatus::Offline => write!(f, "offline"),
            DeviceStatus::Unauthorized => write!(f, "unauthorized"),
            DeviceStatus::Unknown => write!(f, "unknown"),
        }
    }
}

fn parse_device_line(line: &str) -> Option<Device> {
    let parts: Vec<&str> = line.split_whitespace().collect();
    if parts.len() < 2 {
        return None;
    }

    let serial = parts[0].to_string();

    // Skip header line
    if serial == "List" {
        return None;
    }

    let status = match parts[1] {
        "device" => DeviceStatus::Device,
        "offline" => DeviceStatus::Offline,
        "unauthorized" => DeviceStatus::Unauthorized,
        _ => DeviceStatus::Unknown,
    };

    // Parse model from the rest of the line
    let mut model = None;
    for part in &parts[2..] {
        if part.starts_with("model:") {
            model = Some(part.strip_prefix("model:").unwrap_or("").to_string());
            break;
        }
    }

    // Determine connection type
    let connection_type = if serial.contains(':') {
        ConnectionType::Wifi
    } else {
        ConnectionType::Usb
    };

    Some(Device {
        serial,
        model,
        status,
        label: None,
        connection_type,
    })
}

#[tauri::command]
pub async fn get_devices(app: AppHandle) -> Result<Vec<Device>, String> {
    let shell = app.shell();

    let output = shell
        .sidecar("binaries/adb")
        .map_err(|e| format!("Failed to create adb sidecar: {}", e))?
        .args(["devices", "-l"])
        .output()
        .await
        .map_err(|e| format!("Failed to execute adb: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("adb command failed: {}", stderr));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    // Get saved config for labels
    let config = settings::load_config().unwrap_or_default();

    let devices: Vec<Device> = stdout
        .lines()
        .filter_map(|line| {
            let mut device = parse_device_line(line)?;
            // Merge saved label
            if let Some(label) = config.device_labels.get(&device.serial) {
                device.label = Some(label.clone());
            }
            Some(device)
        })
        .collect();

    Ok(devices)
}
