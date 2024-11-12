// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use server::bots;

mod server;

fn main() {
  tauri::Builder::default()
    .setup(|app|{
      let handle = app.handle();
      let boxed_handle = Box::new(handle.clone());

      thread::spawn(move || {
        server::init(*boxed_handle).unwrap();
      });
      thread::spawn(move || {
        bots::twitch::main().unwrap();
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
