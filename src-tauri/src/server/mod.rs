mod handlers;

#[path="models/mod.rs"]
pub mod models;
#[path="ddbb/mod.rs"]
pub mod ddbb;
#[path="bots/mod.rs"]
pub mod bots;
#[path="websocket/mod.rs"]
pub mod websocket;

use std::sync::Mutex;

use actix_cors::Cors;
use actix_files::{Files, NamedFile};
use actix_web::{middleware, http, web, App, HttpServer};
use actix_web::dev::{ServiceRequest, ServiceResponse, fn_service};
use actix_web::http::Uri;
use tauri::AppHandle;

use std::str::FromStr;
use ipnet::Ipv4Net;

pub struct TauriAppState {
    pub app: Mutex<AppHandle>,
    pub twitch_bot: Mutex<bots::twitch::TwitchBotApp>,
}

async fn spa_fallback(req: ServiceRequest) -> Result<ServiceResponse, actix_web::Error> {
    let (http_req, _) = req.into_parts();
    let file = NamedFile::open_async("../dist/index.html").await?;
    let res = file.into_response(&http_req);
    Ok(ServiceResponse::new(http_req, res))
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
        twitch_bot: Mutex::new(bots::twitch::TwitchBotApp::new().await),
    });

    tokio::spawn(bots::twitch::main(tauri_app.twitch_bot.lock().unwrap().clone()));

    let websocket_task = tokio::spawn(websocket::main());
    tokio::spawn(async move {
        if let Err(e) = websocket_task.await {
            println!("Websocket task failed: {:?}", e);
        }
    });
    
    println!("Arrancando actix-web:");
    let backend_server = HttpServer::new(move || {
        let subnet = Ipv4Net::from_str("192.168.1.0/24").unwrap();
        let cors = Cors::default()
            .allowed_origin("http://localhost:4200")
            .allowed_origin("tauri://localhost")
            .allowed_origin("http://127.0.0.1:4200")
            .allowed_origin_fn(move |origin, _req_head| {
                    let origin_str = match origin.to_str() {
                        Ok(s) => s,
                        Err(_) => return false,
                    };

                    let uri = match origin_str.parse::<Uri>() {
                        Ok(u) => u,
                        Err(_) => return false,
                    };

                    let host = match uri.host() {
                        Some(h) => h,
                        None => return false,
                    };

                    // Comprobamos si el host es una IP de tu subred local
                    match host.parse::<std::net::Ipv4Addr>() {
                        Ok(ip) => subnet.contains(&ip),
                        Err(_) => false,
                    }
                })
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(handlers::twitch::create_db)
            .service(handlers::twitch::create_tokens_db)
            .service(handlers::twitch::read)
            .service(handlers::twitch::create)
            .service(handlers::twitch::response)
            .service(handlers::twitch::create_token)
            .service(handlers::twitch::read_token)
            .service(handlers::twitch::get_random_clip)
    })
    .bind(("0.0.0.0", 5000))?
        .run();

    // 2. CONFIGURACIÓN DEL FRONTEND (Puerto 4200)
    let frontend_server = HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(
                Files::new("/overlays", "../dist")
                    .index_file("index.html")
                    .default_handler(spa_fallback)
            )
            .service(
                Files::new("/", "../dist")
                    .index_file("index.html")
                    .default_handler(spa_fallback)
            )
    })
    .bind(("0.0.0.0", 8080))? // Escucha en toda la red local
    .run();

    // 3 juntar los dos procesos y ejecutarlos
    futures::future::try_join(backend_server, frontend_server).await?;

    Ok(())
}
