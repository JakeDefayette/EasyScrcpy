use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WifiModeResult {
    pub ip: String,
    pub port: u16,
}

#[tauri::command]
pub async fn enable_wifi_mode(app: AppHandle, serial: String) -> Result<WifiModeResult, String> {
    let shell = app.shell();

    // First, enable TCP/IP mode on port 5555
    let output = shell
        .sidecar("adb")
        .map_err(|e| format!("Failed to create adb sidecar: {}", e))?
        .args(["-s", &serial, "tcpip", "5555"])
        .output()
        .await
        .map_err(|e| format!("Failed to execute adb tcpip: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to enable TCP/IP mode: {}", stderr));
    }

    // Get device IP address
    let output = shell
        .sidecar("adb")
        .map_err(|e| format!("Failed to create adb sidecar: {}", e))?
        .args(["-s", &serial, "shell", "ip", "route"])
        .output()
        .await
        .map_err(|e| format!("Failed to get IP route: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to get device IP: {}", stderr));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    // Parse IP from route output
    // Format: "... src 192.168.1.x ..."
    let ip = stdout
        .lines()
        .find_map(|line| {
            if let Some(src_idx) = line.find("src ") {
                let ip_start = src_idx + 4;
                let rest = &line[ip_start..];
                rest.split_whitespace().next().map(|s| s.to_string())
            } else {
                None
            }
        })
        .ok_or_else(|| "Could not determine device IP address".to_string())?;

    Ok(WifiModeResult { ip, port: 5555 })
}

#[tauri::command]
pub async fn connect_wifi_device(app: AppHandle, ip: String, port: u16) -> Result<(), String> {
    let shell = app.shell();
    let address = format!("{}:{}", ip, port);

    let output = shell
        .sidecar("adb")
        .map_err(|e| format!("Failed to create adb sidecar: {}", e))?
        .args(["connect", &address])
        .output()
        .await
        .map_err(|e| format!("Failed to connect: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);

    if stdout.contains("connected") || stdout.contains("already") {
        Ok(())
    } else {
        Err(format!("Connection failed: {}", stdout))
    }
}
