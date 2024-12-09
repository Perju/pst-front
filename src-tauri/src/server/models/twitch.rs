use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Command {
    pub id: i32,
    pub name: String,
    pub response: String,
    pub active: bool,
    pub usr_lvl: i32,
}

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

impl Command {
    pub fn new(id: i32, name: &str, response: &str, active: bool, usr_lvl: i32) -> Self {
        Command {
            id,
            name: name.to_string(),
            response: response.to_string(),
            active,
            usr_lvl,
        }
    }
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
