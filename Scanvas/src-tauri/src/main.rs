#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
async fn run_scan() -> Result<String, String> {
    let python_path = "python3";
    let script_path = "../backend/data_formatter.py";

    let output = Command::new(python_path)
        .arg(script_path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8(output.stdout).unwrap_or_default())
    } else {
        Err(String::from_utf8(output.stderr).unwrap_or_default())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_scan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}