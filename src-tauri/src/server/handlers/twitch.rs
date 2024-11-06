use actix_web::{web, error, get,  post, HttpResponse, Error, Result};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::to_string;

use crate::server::models;
use crate::server::ddbb;

 #[derive(Serialize, Deserialize, Debug)]
struct TwitchReadRequest {
    table: String
}

const MAX_SIZE: usize = 262_144; // Payload max size 256k
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
#[post("/api/twitch/read")]
pub async fn read(mut payload: web::Payload) -> Result<HttpResponse, Error> {
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        if(body.len() + chunk.len()) > MAX_SIZE {
            return Err(error::ErrorBadRequest("overflow"));
        }
        body.extend_from_slice(&chunk);
    }
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
pub async fn create(mut payload: web::Payload) -> actix_web::Result<HttpResponse, Error>{
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        if(body.len() + chunk.len()) > MAX_SIZE {
            return Err(error::ErrorBadRequest("overflow"));
        }
        body.extend_from_slice(&chunk);
    }
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
