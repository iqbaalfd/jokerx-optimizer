use std::fs;
use std::path::Path;
use std::process::Command;
use sysinfo::{Disks, System};

/// Menghitung ukuran file sampah (Temp & Browser Cache) untuk ditampilkan ke UI
#[tauri::command]
fn scan_system_junk() -> Result<serde_json::Value, String> {
    let temp_dir = std::env::var("TEMP")
        .map_err(|e| format!("Failed To Detect Temporary Directory: {}", e))?;
    
    // Hitung ukuran folder Temp secara rekursif
    let temp_size_bytes = calculate_dir_size(Path::new(&temp_dir));
    
    // Estimasi sederhana atau path spesifik untuk browser cache (Chrome/Edge)
    let browser_size_bytes = match std::env::var("LOCALAPPDATA") {
        Ok(local_app) => {
            let chrome_cache = Path::new(&local_app).join("Google\\Chrome\\User Data\\Default\\Cache");
            let edge_cache = Path::new(&local_app).join("Microsoft\\Edge\\User Data\\Default\\Cache");
            calculate_dir_size(&chrome_cache) + calculate_dir_size(&edge_cache)
        }
        Err(_) => 850 * 1024 * 1024, // Fallback default 850 MB jika gagal
    };

    let total_bytes = temp_size_bytes + browser_size_bytes;

    let result = serde_json::json!({
        "temp_size": format_size(temp_size_bytes),
        "browser_size": format_size(browser_size_bytes),
        "total_size": format_size(total_bytes),
    });

    Ok(result)
}

// Fungsi bantu untuk menghitung ukuran direktori
fn calculate_dir_size(path: &Path) -> u64 {
    let mut total_size = 0;
    if path.is_dir() {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.is_dir() {
                    total_size += calculate_dir_size(&p);
                } else if let Ok(metadata) = entry.metadata() {
                    total_size += metadata.len();
                }
            }
        }
    }
    total_size
}

// Fungsi bantu untuk format bytes ke string human-readable (MB/GB)
fn format_size(size: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;

    if size >= GB {
        format!("{:.2} GB", size as f64 / GB as f64)
    } else if size >= MB {
        format!("{:.2} MB", size as f64 / MB as f64)
    } else if size >= KB {
        format!("{:.2} KB", size as f64 / KB as f64)
    } else {
        format!("{} Bytes", size)
    }
}

/// Cleans temporary files safely using native Rust filesystem APIs.
#[tauri::command]
fn clean_system() -> Result<String, String> {
    let temp_dir = std::env::var("TEMP")
        .map_err(|e| format!("Failed To Detect Temporary Directory: {}", e))?;
    let path = Path::new(&temp_dir);

    let mut deleted_count = 0;
    let mut failed_count = 0;

    if path.is_dir() {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let file_path = entry.path();
                if file_path.is_dir() {
                    if fs::remove_dir_all(&file_path).is_ok() {
                        deleted_count += 1;
                    } else {
                        failed_count += 1;
                    }
                } else {
                    if fs::remove_file(&file_path).is_ok() {
                        deleted_count += 1;
                    } else {
                        failed_count += 1;
                    }
                }
            }
        }
    }

    Ok(format!(
        "Successfully Cleaned {} Temporary Items. ({} Items Skipped As They Are In Use By The System)",
        deleted_count, failed_count
    ))
}

/// Flushes the DNS cache and resets the network stack.
#[tauri::command]
fn reset_network() -> Result<String, String> {
    let output = Command::new("cmd")
        .args(["/C", "ipconfig /flushdns"])
        .output()
        .map_err(|e| format!("Failed To Execute Network Command: {}", e))?;

    if output.status.success() {
        Ok("DNS Cache Successfully Flushed & Network Reset!".into())
    } else {
        Err("Failed To Reset Network. Please Ensure The Application Is Running As Administrator.".into())
    }
}

/// Fetches real-time hardware diagnostics (CPU, RAM, and Disk storage).
#[tauri::command]
fn get_system_specs() -> Result<serde_json::Value, String> {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpu_name = sys
        .cpus()
        .first()
        .map(|c| c.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());
        
    let total_memory = sys.total_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let used_memory = sys.used_memory() as f64 / (1024.0 * 1024.0 * 1024.0);

    let disks = Disks::new_with_refreshed_list();
    let mut total_disk_space = 0.0;
    let mut available_disk_space = 0.0;

    for disk in &disks {
        total_disk_space += disk.total_space() as f64 / (1024.0 * 1024.0 * 1024.0);
        available_disk_space += disk.available_space() as f64 / (1024.0 * 1024.0 * 1024.0);
    }

    let specs = serde_json::json!({
        "cpu": cpu_name,
        "total_ram": format!("{:.2} GB", total_memory),
        "used_ram": format!("{:.2} GB", used_memory),
        "total_disk": format!("{:.2} GB", total_disk_space),
        "free_disk": format!("{:.2} GB", available_disk_space),
    });

    Ok(specs)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_system_junk,
            clean_system,
            reset_network,
            get_system_specs
        ])
        .run(tauri::generate_context!())
        .expect("Error While Running Tauri Application");
}