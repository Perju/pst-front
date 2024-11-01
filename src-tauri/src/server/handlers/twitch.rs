use actix_web::{web, error, post, HttpResponse, Error, Result};
use futures::StreamExt;
use serde::{Deserialize, Serialize};

 #[derive(Serialize, Deserialize)]
struct MyObj {
    name: String,
    number: i32,
}


const MAX_SIZE: usize = 262_144; // Payload max size 256k
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
    let obj = serde_json::from_slice::<MyObj>(&body)?;
    Ok(HttpResponse::Ok().json(obj))
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
    let obj = serde_json::from_slice::<MyObj>(&body)?;
    Ok(HttpResponse::Ok().json(obj))
}
