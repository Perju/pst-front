use std::collections::VecDeque;
use std::time::{Duration, Instant};
use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;
use dotenv::dotenv;

use tokio::net::{TcpStream, tcp::OwnedReadHalf, tcp::OwnedWriteHalf};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt};

use reqwest::Client;

use tokio_js_set_interval::set_interval_async;
use twitch_api::twitch_oauth2::{ AccessToken, AppAccessToken, TwitchToken, UserToken};
use twitch_api::{helix::channels::GetChannelInformationRequest, TwitchClient};

use crate::server::{self, ddbb};

struct MessageTracker {
    messages: VecDeque<Instant>,
    time_window: Duration,
}

impl MessageTracker {
    fn new(time_window: Duration) -> Self {
        MessageTracker {
            messages: VecDeque::new(),
            time_window,
        }
    }
    
    fn add_message(&mut self) {
        let now = Instant::now();
        self.messages.push_back(now);
        self.cleanup(now);
    }
    
    fn count_recent(&mut self) -> usize {
        let now = Instant::now();
        self.cleanup(now);
        self.messages.len()
    }
    
    fn cleanup(&mut self, now: Instant) {
        while let Some(&time) = self.messages.front() {
            if now.duration_since(time) > self.time_window {
                self.messages.pop_front();
            } else {
                break;
            }
        }
    }
}

#[derive(Clone)]
pub struct TwitchBotApp {
    client: TwitchClient<'static, reqwest::Client>,
    app_token: Result<AppAccessToken, ()>,
    chat_token: Result<UserToken, ()>,
    chat_username: String,
    chat_channel_id: String,
    chat_reader: Arc<Mutex<OwnedReadHalf>>,
    chat_writer: Arc<Mutex<OwnedWriteHalf>>,
    message_tracker: Arc<Mutex<MessageTracker>>,
}

impl TwitchBotApp {
    pub async fn new() -> Self {
        dotenv().ok();
        let tkn_client_id = get_config_value("TKN_CLIENT_ID", "appToken", "DEFAULT_TOKEN");
        let tkn_client_secret = get_config_value("TKN_CLIENT_SECRET", "appSecret", "DEFAULT_TOKEN");
        let tkn_bot= get_config_value("TKN_BOT", "appChatToken", "DEFAULT_TOKEN");
        let client = TwitchClient::default();
        let http_client = Client::new();
        let app_token: Result<AppAccessToken, ()> = match AppAccessToken::get_app_access_token(
            &client,
            tkn_client_id.into(),
            tkn_client_secret.into(),
            vec![],
        ).await {
            Ok(token) => Ok(token),
            Err(err) => {
                eprintln!("Error obteniendo el App Access Token: {}", err);
                Err(())
            }
        };
        let access_token  = AccessToken::new(tkn_bot.to_string());
        let chat_token: Result<UserToken, ()> = match UserToken::from_token(&http_client, access_token).await {
            Ok(token) => Ok(token),
            Err(err) => {
                eprintln!("Error obteniendo el Chat Access Token: {}", err);
                Err(())
            }
        };
        let chat_username = "perju_gatar".to_string();
        let chat_channel_id = get_config_value("CHAT_CHANNEL", "chatChannel", "DEFAULT_CHANNEL");

        // Conectar al servidor IRC de Twitch
        let chat_stream = TcpStream::connect("irc.chat.twitch.tv:6667").await.unwrap();
        let (read, write) = chat_stream.into_split();

        TwitchBotApp {
            client,
            app_token,
            chat_token,
            chat_username,
            chat_channel_id,
            chat_reader: Arc::new(Mutex::new(read)),
            chat_writer: Arc::new(Mutex::new(write)),
            message_tracker: Arc::new(Mutex::new(MessageTracker::new(Duration::from_secs(600)))),
        }
    }

    pub async fn connect_to_chat(&self) -> Result<(), Box<dyn Error>> {
        let mut chat_stream = self.chat_writer.lock().await;

        // let (read, mut write) = chat_stream.into_split();

        chat_stream.write_all(format!("PASS oauth:{}\r\n", self.chat_token.as_ref().unwrap().token().secret()).as_bytes()).await?;
        chat_stream.write_all(format!("NICK {}\r\n", self.chat_username).as_bytes()).await?;
        // Unirse al canal
        chat_stream.write_all(format!("JOIN #{}\r\n", self.chat_channel_id).as_bytes()).await?;
        println!("conectado al chat de Twitch");
        Ok(())
    }

    pub async fn send_chat_message(&self, message: &str) -> Result<(), Box<dyn Error>>  {
        let mut chat_stream = self.chat_writer.lock().await;


        // Enviar un mensaje al chat
        chat_stream.write_all(format!("PRIVMSG #{} :{}\r\n", self.chat_channel_id, message).as_bytes()).await?;
        println!("Mensaje enviado: {}", message);

        Ok(())
    }

    // Leer las respuestas del servidor (opcional)
    pub async fn read_chat(&self) -> Result<(), Box<dyn Error>>{
        let mut chat_stream = self.chat_reader.lock().await;
        let mut reader = tokio::io::BufReader::new(&mut *chat_stream);

        let commands = ddbb::twitch::read_commands().unwrap();

        let mut line = String::new();
        while reader.read_line(&mut line).await? > 0{
            let bot_chat_username = self.chat_token.as_ref().unwrap().login.to_string();
            if line.contains("#perju_gatar :") {
                let start_name = line.find("@").unwrap_or(0);
                let end_name = line.find(".tmi.twitch.tv").unwrap_or(0);
                let sender = line[start_name+1..end_name].to_string();
                let mut tracker = self.message_tracker.lock().await;
                if sender != bot_chat_username {
                    tracker.add_message();
                }
                let (_before, after) = line.split_once( "#perju_gatar :").unwrap();
                // si es un comando buscanmos entre los comandos
                if after.starts_with("!") {
                    let result = commands.iter().find(|c|{
                        let mut command_name = "!".to_owned();
                        command_name.push_str(&c.name);
                        after.starts_with(&command_name)
                    });
                    match result {
                        Some(command)=> {
                            println!("La respuesta al comando recibido es {:?}", command);
                            let message: String = self.replace_variables(command, after, &sender).await;
                            self.send_chat_message(&message).await;
                            ()
                        },
                        None => println!("No hay respuesta para el comando recibido"),
                    }
                }
            }

            line.clear();
        }

        Ok(())
    }

    pub async fn get_channel_info(&self) -> std::io::Result<()> {
        let req = GetChannelInformationRequest::broadcaster_ids(&["37113434"]);
        let app_token = self.app_token.clone().unwrap();

        let response = self.client.helix.req_get(req, &app_token).await;
        match response {
            Ok(data) => {
                if let Some(channel) = data.data.get(0) {
                    println!("Channel Title: {}", channel.title);
                    println!("Channel Game: {}", channel.game_name);
                }
            }
            Err(e) => {
                eprintln!("Error fetching channel info: {}", e);
            }
        }

        Ok(())
    }

    async fn replace_variables(&self, command: &server::models::twitch::Command, _after: &str, sender: &str) -> String {
        let mut response: String = command.response.to_string().to_owned();
        let words = _after.split(" ").collect::<Vec<&str>>();
        response = response.replace("${sender}", sender);
        for(i, word) in words.iter().enumerate(){
            let placeholder = format!("${{{}}}", i);
            response = response.replace(&placeholder, word);
        }

        response
    }
}

fn get_config_value(env_var: &str, db_key: &str, default: &str) -> String {
    std::env::var(env_var).ok()
        .or_else(|| {
            match ddbb::twitch::read_token(db_key.to_string()) {
                Ok(token) => Some(token.value),
                Err(err) => {
                    eprintln!("Error obteniendo '{}' desde la base de datos: {}", db_key, err);
                    None
                }
            }
        })
        .unwrap_or_else(|| {
            eprintln!("No se pudo obtener '{}'. Usando un valor por defecto.", env_var);
            default.to_string()
        })
}


pub fn set_timer(bot: TwitchBotApp, msg: String, ms: u64) -> u64{
    let timer_id = set_interval_async!({
        let bot_clon = bot.clone();
        let msg_clon = msg.clone();
        async move {
            // Cuenta de los mensajes recibidos en los ultimos X minutos
            let recent_count = {
                let mut tracker = bot_clon.message_tracker.lock().await;
                tracker.count_recent()
            };
            
            // Si se han recibido la cantidad minima se envia el mensaje temporizado
            println!("Se han recibido {} mensajes en los ultimos 10 minutos", recent_count);
            if recent_count > 5 {
                if let Err(e) = bot_clon.send_chat_message(&msg_clon.to_string()).await {
                    println!("Erro al enviar el mensaje {}", e)
                }
            }
        }
    }, ms);
    timer_id
}

pub async fn main(twitch_bot: TwitchBotApp) -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    let channel_info = twitch_bot.get_channel_info().await;
    match channel_info {
        Ok(_) => {"Mensaje enviado correctamente"},
        Err(_) => {"Error al enviar el mensaje"},
    };

    // Conectar al chat
    twitch_bot.connect_to_chat().await;

    // cargart fraes temporizadas
    let timers = ddbb::twitch::read_timers().unwrap();
    for timer in timers.iter() {
        set_timer(twitch_bot.clone(), timer.message.to_string(), (timer.period * 1000) as u64);
    }

    // leer mensajes del chat y contestar comandos
    twitch_bot.read_chat().await;
    tokio::signal::ctrl_c().await.unwrap();
    Ok(())
}
