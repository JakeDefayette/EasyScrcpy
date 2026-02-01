mod commands;

use commands::{devices, mirror, settings, wifi};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(mirror::MirrorState::default())
        .invoke_handler(tauri::generate_handler![
            devices::get_devices,
            mirror::start_mirror,
            mirror::stop_mirror,
            mirror::stop_all_mirrors,
            mirror::get_active_mirrors,
            settings::get_config,
            settings::save_device_label,
            settings::save_settings,
            wifi::enable_wifi_mode,
            wifi::connect_wifi_device,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
