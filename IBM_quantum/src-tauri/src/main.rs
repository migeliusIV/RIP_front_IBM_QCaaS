// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//     tauri::Builder::default()
//         .plugin(tauri_plugin_http::init())
//         .run(tauri::generate_context!())
//         .expect("error while running Tauri application");
// }

// fn main() {
//     tauri::Builder::default()
//         .plugin(tauri_plugin_http::init())
//         .run(tauri::generate_context!())
//         .unwrap();
// }

fn main() {
  app_lib::run();
}