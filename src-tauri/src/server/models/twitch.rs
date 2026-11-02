use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Timer {
    pub id: i32,
    pub name: String,
    pub message: String,
    pub active: bool,
    pub period: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AppToken {
    pub id: i32,
    pub client_id: String,
    pub client_secret: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Token {
    pub name: String,
    pub value: String,
}

impl Timer {
    pub fn new(id: i32, name: &str, message: &str, active: bool, period: i32) -> Self {
        Timer {
            id,
            name: name.to_string(),
            message: message.to_string(),
            active,
            period,
        }
    }
}
