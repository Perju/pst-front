mod handlers;

#[path="models/mod.rs"]
pub mod models;
#[path="ddbb/mod.rs"]
pub mod ddbb;

use std::sync::Mutex;

use actix_cors::Cors;
use actix_web::{middleware, http, web, App, HttpServer};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });


    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:4200")
            .allowed_origin("http://127.0.0.1:4200")
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(handlers::twitch::create_db)
            .service(handlers::twitch::read)
            .service(handlers::twitch::create)
    })
    .bind(("127.0.0.1", 5000))?
    .run()
    .await
}
