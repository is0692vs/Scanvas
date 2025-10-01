#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
async fn run_scan() -> Result<String, String> {
    let python_path = "python3";
    
    // Get the path to the backend script relative to the current executable
    // In development, we need to go up from the Tauri src directory
    // Use absolute path construction based on project root
    let script_path = if cfg!(debug_assertions) {
        // Development mode: use path relative to workspace root
        // When running from Scanvas directory, backend is at ../../backend/
        std::env::current_dir()
            .map_err(|e| format!("Failed to get current directory: {}", e))?
            .join("../../backend/data_formatter.py")
            .canonicalize()
            .map_err(|e| format!("Failed to resolve backend path: {}. Make sure the backend directory exists.", e))?
    } else {
        // Production mode: script should be bundled with the app
        std::env::current_exe()
            .map_err(|e| format!("Failed to get current executable path: {}", e))?
            .parent()
            .ok_or("Failed to get parent directory")?
            .join("../backend/data_formatter.py")
    };

    eprintln!("Attempting to run Python script at: {:?}", script_path);

    let output = Command::new(python_path)
        .arg(&script_path)
        .output()
        .map_err(|e| format!("Failed to execute Python command: {}", e))?;

    eprintln!("Python exit status: {}", output.status);
    eprintln!("Python stdout length: {}", output.stdout.len());
    eprintln!("Python stderr: {}", String::from_utf8_lossy(&output.stderr));

    if output.status.success() {
        let stdout = String::from_utf8(output.stdout)
            .map_err(|e| format!("Invalid UTF-8 in Python output: {}", e))?;
        Ok(stdout)
    } else {
        let stderr = String::from_utf8(output.stderr)
            .unwrap_or_else(|_| "Failed to decode error message".to_string());
        Err(format!("Python script failed: {}", stderr))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_scan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}