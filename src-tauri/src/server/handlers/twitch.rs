use actix_web::{web, error, get,  post, HttpResponse, Error, Result};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::to_string;

use crate::server::models;
use crate::server::ddbb;

// #[path="../models/mod.rs"]
// mod models;

// #[path="../ddbb/mod.rs"]
// mod ddbb;

 #[derive(Serialize, Deserialize, Debug)]
struct TwitchReadRequest {
    table: String
}
 #[derive(Serialize, Deserialize, Debug)]
struct TwitchCreateRequest {
    table: String,
    data: Option<models::twitch::Command>,
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
    println!("Leyendo datos para twitch");
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
    if obj.table == "twitch_commands" {
        let command = ddbb::twitch::read_commands().unwrap();
        println!("Command {:?}", command);
        data_json = to_string(&command).unwrap();
    }
    println!("Respuesta {}", data_json);
    Ok(HttpResponse::Ok().json(data_json))
}

#[post("/api/twitch/create")]
pub async fn create(mut payload: web::Payload) -> actix_web::Result<HttpResponse, Error>{
    println!("Guardando datos para twitch");
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        if(body.len() + chunk.len()) > MAX_SIZE {
            return Err(error::ErrorBadRequest("overflow"));
        }
        body.extend_from_slice(&chunk);
    }
    let obj = serde_json::from_slice::<TwitchCreateRequest>(&body)?;
    if obj.table == "twitch_commands" {
        let command_data = obj.data;
        let command: &models::twitch::Command = &command_data.unwrap();
        ddbb::twitch::create_command(command).unwrap();
    }
    Ok(HttpResponse::Ok().json(""))
}
