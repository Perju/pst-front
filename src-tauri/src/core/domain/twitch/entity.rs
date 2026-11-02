use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Command {
    pub id: i32,
    pub name: String,
    pub response: String,
    pub active: bool,
    pub usr_lvl: i32,
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
