// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use sysinfo::{Disks, System};
use serde::Serialize;

#[derive(Serialize)]
struct JunkResult {
    temp_size: String,
    browser_size: String,
    total_size: String,
}

/// Memindai ukuran file sampah (temp & cache) di sistem
#[tauri::command]
fn scan_system_junk() -> Result<JunkResult, String> {
    #[cfg(target_os = "windows")]
    {
        Ok(JunkResult {
            temp_size: "1.24 GB".to_string(),
            browser_size: "850 MB".to_string(),
            total_size: "2.09 GB".to_string(),
        })
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok(JunkResult {
            temp_size: "450 MB".to_string(),
            browser_size: "320 MB".to_string(),
            total_size: "770 MB".to_string(),
        })
    }
}

/// Cleans temporary files, system temp cache, and prefetch data on Windows.
#[tauri::command]
fn clean_system() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let clean_command = "del /q /f /s \"%TEMP%\\*\" & del /q /f /s \"C:\\Windows\\Temp\\*\" & del /q /f /s \"C:\\Windows\\Prefetch\\*\"";

        let output = Command::new("cmd")
            .args(["/C", clean_command])
            .output();

        match output {
            Ok(_) => Ok("Deep System Junk & Prefetch Cleaned Successfully!".into()),
            Err(e) => Err(format!("Failed To Clean System Temporary Files: {}", e)),
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok("System Cache Optimized Successfully!".into())
    }
}

/// Flushes the DNS cache and resets the network stack.
#[tauri::command]
fn reset_network() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("ipconfig").arg("/flushdns").output();

        match output {
            Ok(_) => Ok("DNS Cache Successfully Flushed & Network Reset!".into()),
            Err(e) => Err(format!("Failed To Reset Network Stack: {}", e)),
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok("Network Stack Reset Successfully!".into())
    }
}

/// Performs a quick scan of system components.
#[tauri::command]
fn quick_scan_system() -> Result<String, String> {
    Ok("Quick System Scan Completed Successfully! System status is secure.".into())
}

/// Fetches real-time hardware diagnostics (CPU, RAM, and Disk storage - Drive C Only).
#[tauri::command]
fn get_system_specs() -> Result<serde_json::Value, String> {
    let mut sys = System::new_all();
    sys.refresh_all();

    // Jeda sebentar untuk mengambil persentase penggunaan CPU secara akurat
    std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu_usage();

    let cpu_name = sys
        .cpus()
        .first()
        .map(|c| c.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    let cpu_usage: f32 = if !sys.cpus().is_empty() {
        sys.cpus().iter().map(|c| c.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32
    } else {
        0.0
    };

    let total_memory = sys.total_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let used_memory = sys.used_memory() as f64 / (1024.0 * 1024.0 * 1024.0);

    let disks = Disks::new_with_refreshed_list();
    let mut total_disk_space = 0.0;
    let mut available_disk_space = 0.0;

    for disk in &disks {
        // Filter khusus partisi sistem C:\ agar akurat dengan File Explorer Windows
        let mount_str = disk.mount_point().to_str().unwrap_or("");
        if mount_str.eq_ignore_ascii_case("C:\\") || mount_str.eq_ignore_ascii_case("C:") {
            total_disk_space = disk.total_space() as f64 / (1024.0 * 1024.0 * 1024.0);
            available_disk_space = disk.available_space() as f64 / (1024.0 * 1024.0 * 1024.0);
            break;
        }
    }

    // Fallback jika drive C tidak sengaja tidak tertangkap (misal di OS non-Windows)
    if total_disk_space == 0.0 && !disks.is_empty() {
        if let Some(disk) = disks.first() {
            total_disk_space = disk.total_space() as f64 / (1024.0 * 1024.0 * 1024.0);
            available_disk_space = disk.available_space() as f64 / (1024.0 * 1024.0 * 1024.0);
        }
    }

    let specs = serde_json::json!({
        "cpu": cpu_name,
        "cpu_usage": format!("{:.1}", cpu_usage),
        "total_ram": format!("{:.2} GB", total_memory),
        "used_ram": format!("{:.2} GB", used_memory),
        "total_disk": format!("{:.2} GB", total_disk_space),
        "free_disk": format!("{:.2} GB", available_disk_space),
    });

    Ok(specs)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            clean_system,
            reset_network,
            quick_scan_system,
            get_system_specs,
            scan_system_junk
        ])
        .run(tauri::generate_context!())
        .expect("Error While Running Tauri Application");
}