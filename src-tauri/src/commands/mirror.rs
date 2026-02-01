use serde::{Deserialize, Serialize};
use std::collections::HashMap;
#[allow(unused_imports)]
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, State};
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

pub struct MirrorState {
    pub processes: Arc<Mutex<HashMap<String, CommandChild>>>,
}

impl Default for MirrorState {
    fn default() -> Self {
        Self {
            processes: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MirrorOptions {
    pub serial: String,
    pub label: Option<String>,
    pub audio: bool,
    pub show_touches: bool,
    pub orientation: u8,
    pub resolution: u16,
    pub bitrate: u32,
}

#[tauri::command]
pub async fn start_mirror(
    app: AppHandle,
    state: State<'_, MirrorState>,
    options: MirrorOptions,
) -> Result<u32, String> {
    let shell = app.shell();

    // Build scrcpy arguments
    let mut args: Vec<String> = vec!["-s".to_string(), options.serial.clone()];

    // Window title
    if let Some(ref label) = options.label {
        args.push(format!("--window-title={}", label));
    } else {
        args.push(format!("--window-title={}", options.serial));
    }

    // Show touches
    if options.show_touches {
        args.push("--show-touches".to_string());
    }

    // Audio forwarding (Android 11+)
    if options.audio {
        args.push("--audio-codec=aac".to_string());
    } else {
        args.push("--no-audio".to_string());
    }

    // Orientation: use --angle to rotate the displayed video
    // This rotates the window content without changing capture dimensions
    let angle = match options.orientation {
        1 => 90,   // landscape
        3 => 270,  // reverse landscape
        2 => 180,  // upsidedown
        _ => 0,    // portrait
    };
    if angle > 0 {
        args.push(format!("--angle={}", angle));
    }

    // Quality settings
    args.push(format!("--max-size={}", options.resolution));
    args.push(format!("--video-bit-rate={}", options.bitrate));

    // Spawn scrcpy process
    let (mut rx, child) = shell
        .sidecar("scrcpy")
        .map_err(|e| format!("Failed to create scrcpy sidecar: {}", e))?
        .args(&args)
        .spawn()
        .map_err(|e| format!("Failed to spawn scrcpy: {}", e))?;

    let pid = child.pid();

    // Store process handle
    {
        let mut processes = state
            .processes
            .lock()
            .map_err(|e| format!("Failed to lock processes: {}", e))?;
        processes.insert(options.serial.clone(), child);
    }

    // Clone Arc for the spawned task
    let processes_arc = Arc::clone(&state.processes);
    let serial = options.serial.clone();

    // Spawn a task to handle process events
    tauri::async_runtime::spawn(async move {
        use tauri_plugin_shell::process::CommandEvent;
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Terminated(payload) => {
                    eprintln!("scrcpy terminated for {}: code={:?}, signal={:?}", serial, payload.code, payload.signal);
                    // Clean up when process terminates
                    if let Ok(mut processes) = processes_arc.lock() {
                        processes.remove(&serial);
                    }
                    break;
                }
                CommandEvent::Error(err) => {
                    eprintln!("scrcpy error for {}: {}", serial, err);
                }
                CommandEvent::Stdout(line) => {
                    let text = String::from_utf8_lossy(&line);
                    eprintln!("scrcpy stdout for {}: {}", serial, text.trim());
                }
                CommandEvent::Stderr(line) => {
                    let text = String::from_utf8_lossy(&line);
                    eprintln!("scrcpy stderr for {}: {}", serial, text.trim());
                }
                _ => {}
            }
        }
    });

    Ok(pid)
}

#[tauri::command]
pub fn stop_mirror(state: State<'_, MirrorState>, serial: String) -> Result<(), String> {
    let mut processes = state
        .processes
        .lock()
        .map_err(|e| format!("Failed to lock processes: {}", e))?;

    if let Some(child) = processes.remove(&serial) {
        child
            .kill()
            .map_err(|e| format!("Failed to kill process: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
pub fn stop_all_mirrors(state: State<'_, MirrorState>) -> Result<(), String> {
    let mut processes = state
        .processes
        .lock()
        .map_err(|e| format!("Failed to lock processes: {}", e))?;

    for (serial, child) in processes.drain() {
        if let Err(e) = child.kill() {
            eprintln!("Failed to kill process for {}: {}", serial, e);
        }
    }

    Ok(())
}

#[tauri::command]
pub fn get_active_mirrors(state: State<'_, MirrorState>) -> Result<Vec<String>, String> {
    let processes = state
        .processes
        .lock()
        .map_err(|e| format!("Failed to lock processes: {}", e))?;

    Ok(processes.keys().cloned().collect())
}
