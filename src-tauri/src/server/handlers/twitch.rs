use actix_web::{web, get,  post, HttpResponse, Error, Result};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use web::BytesMut;

use crate::server::models;
use crate::server::ddbb;

#[derive(Serialize, Deserialize, Debug)]
struct TwitchReadRequest {
    table: String
}

#[derive(Deserialize, Debug)]
struct TokenResponse {
    code: String,
    scope: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct TwitchTokenRequest {
    name: String
}

const MAX_SIZE: usize = 262_144; // Payload max size 256k
async fn extract_payload(mut payload: web::Payload) -> Result<BytesMut, Error>{
    let mut body = BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        if(body.len() + chunk.len()) > MAX_SIZE {
            return Err(actix_web::error::ErrorBadRequest("Payload overflow"));
        }
        body.extend_from_slice(&chunk);
    }
    Ok(body)
}

#[get("/api/twitch/create_db")]
pub async fn create_db() -> Result<HttpResponse, Error> {
    ddbb::twitch::create_tables().unwrap();
    let obj = serde_json::json!({
        "code": 200,
        "success": true,
        "payload": {
            "resultado": "todo ha ido bien"
        }
    });
    Ok(HttpResponse::Ok().json(obj))
}

#[get("/api/twitch/create_tokens_db")]
pub async fn create_tokens_db() -> Result<HttpResponse, Error> {
    println!("creando la base de datos para los tokens");
    ddbb::twitch::create_table_tokens().unwrap();
    let obj = serde_json::json!({
        "code": 200,
        "success": true,
        "payload": {
            "resultado": "todo ha ido bien"
        }
    });
    Ok(HttpResponse::Ok().json(obj))
}

#[post("/api/twitch/read")]
pub async fn read(payload: web::Payload) -> Result<HttpResponse, Error> {
    let body: BytesMut = extract_payload(payload).await?;
    let obj = serde_json::from_slice::<TwitchReadRequest>(&body)?;
    let mut data_json: String = "".to_string();
    match obj.table.as_str() {
        "twitch_commands" => {
            let command = ddbb::twitch::read_commands().unwrap();
            data_json = to_string(&command).unwrap();
        },
        "twitch_timers" => {
            let timer = ddbb::twitch::read_timers().unwrap();
            data_json = to_string(&timer).unwrap();
        },
        _ => {}
    }
    Ok(HttpResponse::Ok().json(data_json))
}

#[post("/api/twitch/create")]
pub async fn create(payload: web::Payload) -> actix_web::Result<HttpResponse, Error>{
    let body: BytesMut = extract_payload(payload).await?;
    let obj = serde_json::from_slice::<serde_json::Value>(&body)?;
    match obj["table"].as_str().unwrap() {
        "twitch_commands" => {
            let json_string = serde_json::to_string_pretty(&obj["data"])?;
            let command: &models::twitch::Command = &serde_json::from_str(json_string.as_str()).unwrap();
            ddbb::twitch::create_command(command).unwrap();
        },
        "twitch_timers" => {
            let json_string = serde_json::to_string_pretty(&obj["data"])?;
            let timer: &models::twitch::Timer = &serde_json::from_str(json_string.as_str()).unwrap();
            ddbb::twitch::create_timer(timer).unwrap();
        },
        _ => {}
    }
    Ok(HttpResponse::Ok().json(""))
}

/**
 * Tokens
 * * * * * */
#[get("/auth/token/response")]
pub async fn response(response: web::Query<TokenResponse>) -> Result<HttpResponse, Error> {
    println!("El token es: {}", response.code);
    println!("El scope es: {}", response.scope);
    Ok(HttpResponse::Ok().json(""))
}

#[post("/api/twitch/token/create")]
pub async fn create_token(payload: web::Payload) -> actix_web::Result<HttpResponse, Error>{
    let body: BytesMut = extract_payload(payload).await?;
    let obj = serde_json::from_slice::<serde_json::Value>(&body)?;
    let json_string = serde_json::to_string_pretty(&obj)?;
    let token: &models::twitch::Token = &serde_json::from_str(json_string.as_str()).unwrap();
    match ddbb::twitch::read_token(token.name.clone()) {
        Ok(v) => {
            ddbb::twitch::update_token(token).unwrap();
            println!("Que es esto {:?}", v);
        },
        Err(e) => ddbb::twitch::add_token(token).unwrap(),
    };

    Ok(HttpResponse::Ok().json(""))
}

#[post("/api/twitch/token/read")]
pub async fn read_token(payload: web::Payload) -> Result<HttpResponse, Error> {
    let body: BytesMut = extract_payload(payload).await?;
    let obj = serde_json::from_slice::<TwitchTokenRequest>(&body)?;
    println!("El token pedido es {}", obj.name);
    let token = ddbb::twitch::read_token(obj.name).unwrap();
    let data_json = to_string(&token).unwrap();

    Ok(HttpResponse::Ok().json(data_json))
}
