#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

#[tauri::command]
async fn run_scan(app: tauri::AppHandle) -> Result<String, String> {
    println!("[Rust] run_scan command called");

    if cfg!(debug_assertions) {
        // Development mode: use Python script
        let current_dir = std::env::current_dir()
            .map_err(|e| format!("Failed to get current directory: {}", e))?;
        println!("[Rust] Current directory: {:?}", current_dir);

        // Try src-tauri/backend first
        let local_backend = current_dir.join("backend").join("data_formatter.py");
        if local_backend.exists() {
            println!("[Rust] Using local backend: {:?}", local_backend);

            let output = Command::new("python3")
                .arg(&local_backend)
                .output()
                .map_err(|e| format!("Failed to execute Python: {}", e))?;

            return handle_output(output);
        } else {
            // Fallback to workspace root
            let scanvas_dir = current_dir.parent()
                .ok_or("Failed to get parent directory (Scanvas)")?;
            let workspace_root = scanvas_dir.parent()
                .ok_or("Failed to get parent directory (workspace root)")?;
            let backend_path = workspace_root.join("backend").join("data_formatter.py");

            if !backend_path.exists() {
                return Err(format!("Backend script not found at: {:?}", backend_path));
            }

            println!("[Rust] Using workspace backend: {:?}", backend_path);

            let output = Command::new("python3")
                .arg(&backend_path)
                .output()
                .map_err(|e| format!("Failed to execute Python: {}", e))?;

            return handle_output(output);
        }
    } else {
        // Production mode: use bundled binary resource
        let resource_dir = app.path()
            .resource_dir()
            .map_err(|e| format!("Failed to get resource dir: {}", e))?;

        println!("[Rust] Resource directory: {:?}", resource_dir);

        // List all files in resource directory for debugging
        if let Ok(entries) = std::fs::read_dir(&resource_dir) {
            println!("[Rust] Files in resource directory:");
            for entry in entries.flatten() {
                println!("[Rust]   - {:?}", entry.path());
            }
        }

        // Try different binary names
        let binary_name = if cfg!(target_os = "windows") {
            "data_formatter.exe"
        } else {
            "data_formatter"
        };

        let binary_path = resource_dir.join(binary_name);
        println!("[Rust] Looking for binary at: {:?}", binary_path);

        if !binary_path.exists() {
            return Err(format!("Binary not found at: {:?}", binary_path));
        }

        // Make sure it's executable on Unix
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let mut perms = std::fs::metadata(&binary_path)
                .map_err(|e| format!("Failed to get file metadata: {}", e))?
                .permissions();
            perms.set_mode(0o755);
            std::fs::set_permissions(&binary_path, perms)
                .map_err(|e| format!("Failed to set permissions: {}", e))?;
        }

        println!("[Rust] Executing binary: {:?}", binary_path);

        let output = Command::new(&binary_path)
            .output()
            .map_err(|e| {
                let error_msg = format!("Failed to execute binary: {}", e);
                println!("[Rust Error] {}", error_msg);
                error_msg
            })?;

        return handle_output(output);
    }
}

fn handle_output(output: std::process::Output) -> Result<String, String> {
    println!("[Rust] Exit status: {}", output.status);
    println!("[Rust] Stdout length: {} bytes", output.stdout.len());

    let stderr_output = String::from_utf8_lossy(&output.stderr);
    if !stderr_output.is_empty() {
        println!("[Rust] Stderr: {}", stderr_output);
    }

    if output.status.success() {
        let stdout = String::from_utf8(output.stdout)
            .map_err(|e| format!("Invalid UTF-8 in output: {}", e))?;
        println!("[Rust] Successfully received {} bytes", stdout.len());
        println!("[Rust] First 20000 chars: {}",
                 if stdout.len() > 20000 { &stdout[..20000] } else { &stdout });
        Ok(stdout)
    } else {
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Failed to decode error message".to_string());
        let error_msg = format!("Binary failed with status {}: {}", output.status, stderr);
        println!("[Rust Error] {}", error_msg);
        Err(error_msg)
    }
}

fn main() {
    println!("[Rust] Starting Scanvas application...");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_scan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
