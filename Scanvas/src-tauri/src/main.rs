#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

#[tauri::command]
async fn run_scan(app: tauri::AppHandle) -> Result<String, String> {
    println!("[Rust] run_scan command called");
    let python_path = "python3";

    let script_path = if cfg!(debug_assertions) {
        // Development mode
        let current_dir = std::env::current_dir()
            .map_err(|e| format!("Failed to get current directory: {}", e))?;
        println!("[Rust] Current directory: {:?}", current_dir);

        let scanvas_dir = current_dir.parent()
            .ok_or("Failed to get parent directory (Scanvas)")?;
        println!("[Rust] Scanvas directory: {:?}", scanvas_dir);

        let workspace_root = scanvas_dir.parent()
            .ok_or("Failed to get parent directory (workspace root)")?;
        println!("[Rust] Workspace root: {:?}", workspace_root);

        let backend_path = workspace_root.join("backend/data_formatter.py");
        println!("[Rust] Trying backend path: {:?}", backend_path);

        if !backend_path.exists() {
            return Err(format!("Backend script not found at: {:?}", backend_path));
        }

        backend_path
    } else {
        // Production mode: use bundled resources
        let resource_dir = app.path()
            .resource_dir()
            .map_err(|e| format!("Failed to get resource dir: {}", e))?;

        let backend_path = resource_dir.join("backend").join("data_formatter.py");
        println!("[Rust] Production mode - backend path: {:?}", backend_path);

        if !backend_path.exists() {
            return Err(format!("Backend script not found at: {:?}", backend_path));
        }

        backend_path
    };

    println!("[Rust] Attempting to run Python script at: {:?}", script_path);
    println!("[Rust] Using Python executable: {}", python_path);

    let output = Command::new(python_path)
        .arg(&script_path)
        .output()
        .map_err(|e| {
            let error_msg = format!("Failed to execute Python command: {}", e);
            println!("[Rust Error] {}", error_msg);
            error_msg
        })?;

    println!("[Rust] Python exit status: {}", output.status);
    println!("[Rust] Python stdout length: {} bytes", output.stdout.len());

    let stderr_output = String::from_utf8_lossy(&output.stderr);
    if !stderr_output.is_empty() {
        println!("[Rust] Python stderr: {}", stderr_output);
    }

    if output.status.success() {
        let stdout = String::from_utf8(output.stdout)
            .map_err(|e| {
                let error_msg = format!("Invalid UTF-8 in Python output: {}", e);
                println!("[Rust Error] {}", error_msg);
                error_msg
            })?;
        println!("[Rust] Successfully received {} bytes from Python", stdout.len());
        println!("[Rust] First 200 chars of output: {}",
                 if stdout.len() > 200 { &stdout[..200] } else { &stdout });
        Ok(stdout)
    } else {
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Failed to decode error message".to_string());
        let error_msg = format!("Python script failed with status {}: {}", output.status, stderr);
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
