use rusqlite::{Connection, Result};

use crate::server::models;

pub fn create_tables() -> Result<()> {
    let conn = Connection::open("twitch.db")?;
    conn.execute(
        "create table if not exists commands (
             id integer primary key,
             name text not null unique,
             response text,
             active boolean,
             usr_lvl integer
         )",
        []
    )?;

    conn.execute(
        "create table if not exists timers (
             id integer primary key,
             name text not null unique,
             message text,
             active boolean,
             period integer
         )",
        []
    )?;
    Ok(())
}

pub fn create_command(command: &models::twitch::Command) -> Result<()> {
    let conn = Connection::open("twitch.db")?;

    match conn.execute(
        "INSERT INTO commands (name, response, active, usr_lvl) VALUES (?1, ?2, ?3, ?4)",
        (&command.name, &command.response, &command.active, &command.usr_lvl)
    ){
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

pub fn read_commands() -> Result<Vec<models::twitch::Command>> {
    let conn = Connection::open("twitch.db")?;

    let mut stmt = conn.prepare("SELECT id, name, response, active, usr_lvl FROM commands")?;
    let command_iter = stmt.query_map([], |row| {
       Ok(models::twitch::Command {
           id: row.get(0)?,
           name: row.get(1)?,
           response: row.get(2)?,
           active: row.get(3)?,
           usr_lvl: row.get(4)?,
       })
    })?;
    // rellenamos el vector con los elementos conseguidos en la consulta
    let mut v: Vec<models::twitch::Command> = Vec::new();
    for command in command_iter {
        let value= command.unwrap();
        v.push(value);
    }
    // devolvemos el vector
    Ok(v)
}

pub fn create_timer(command: &models::twitch::Timer) -> Result<()> {
    let conn = Connection::open("twitch.db")?;

    match conn.execute(
        "INSERT INTO timers (name, message, active, period) VALUES (?1, ?2, ?3, ?4)",
        (&command.name, &command.message, &command.active, &command.period)
    ){
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

pub fn read_timers() -> Result<Vec<models::twitch::Timer>> {
    let conn = Connection::open("twitch.db")?;

    let mut stmt = conn.prepare("SELECT id, name, message, active, period FROM timers")?;
    let command_iter = stmt.query_map([], |row| {
       Ok(models::twitch::Timer {
           id: row.get(0)?,
           name: row.get(1)?,
           message: row.get(2)?,
           active: row.get(3)?,
           period: row.get(4)?,
       })
    })?;
    // rellenamos el vector con los elementos conseguidos en la consulta
    let mut v: Vec<models::twitch::Timer> = Vec::new();
    for command in command_iter {
        let value= command.unwrap();
        v.push(value);
    }
    // devolvemos el vector
    Ok(v)
}
