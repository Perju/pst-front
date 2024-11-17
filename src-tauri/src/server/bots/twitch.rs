use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;
use dotenv::dotenv;

use tokio::net::{TcpStream, tcp::OwnedReadHalf, tcp::OwnedWriteHalf};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::io::Lines;

use reqwest::Client;

use tokio_js_set_interval::set_interval_async;
use twitch_api::twitch_oauth2::{ AccessToken, AppAccessToken, TwitchToken, UserToken};
use twitch_api::{helix::channels::GetChannelInformationRequest, TwitchClient};

#[derive(Clone)]
pub struct TwitchBotApp {
    client: TwitchClient<'static, reqwest::Client>,
    app_token: AppAccessToken,
    chat_token: UserToken,
    chat_username: String,
    chat_channel_id: String,
    chat_reader: Arc<Mutex<OwnedReadHalf>>,
    chat_writer: Arc<Mutex<OwnedWriteHalf>>,
}

impl TwitchBotApp {
    async fn new() -> Self {
        dotenv().ok();
        let tkn_client_id = std::env::var("TKN_CLIENT_ID").unwrap();
        let tkn_client_secret = std::env::var("TKN_CLIENT_SECRET").unwrap();
        let tkn_bot = std::env::var("TKN_BOT").unwrap();
        let client = TwitchClient::default();
        let http_client = Client::new();
        let app_token =AppAccessToken::get_app_access_token(
            &client,
            tkn_client_id.into(),
            tkn_client_secret.into(),
            vec![],
        ).await.unwrap();
        let access_token  = AccessToken::new(tkn_bot.to_string());
        let chat_token = UserToken::from_token(&http_client, access_token).await.unwrap();
        let chat_username = "perju_gatar".to_string();
        let chat_channel_id = "perju_gatar".to_string();

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
        }
    }

    async fn connect_to_chat(&self) -> Result<(), Box<dyn Error>> {
        let mut chat_stream = self.chat_writer.lock().await;

        // let (read, mut write) = chat_stream.into_split();

        chat_stream.write_all(format!("PASS oauth:{}\r\n", self.chat_token.token().secret()).as_bytes()).await?;
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

        let mut line = String::new();
        while reader.read_line(&mut line).await? > 0{
            println!("Recibido: {}", line);
            line.clear();
        }

        Ok(())
    }

    pub async fn get_channel_info(&self) -> std::io::Result<()> {
        let req = GetChannelInformationRequest::broadcaster_ids(&["37113434"]);

        let response = self.client.helix.req_get(req, &self.app_token).await;
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
}

fn set_timer(bot: TwitchBotApp, msg: String, ms: u64) -> u64{
    let timer_id = set_interval_async!({
        let bot_clon = bot.clone();
        let msg_clon = msg.clone();
        async move {
            if let Err(e) = bot_clon.send_chat_message(&msg_clon.to_string()).await {
                println!("Erro al enviar el mensaje {}", e)
            }
        }
    }, ms);
    timer_id
}

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    let twitch_bot: TwitchBotApp = TwitchBotApp::new().await;
    let channel_info = twitch_bot.get_channel_info().await;
    match channel_info {
        Ok(_) => {"Mensaje enviado correctamente"},
        Err(_) => {"Error al enviar el mensaje"},
    };
    twitch_bot.connect_to_chat().await;
    twitch_bot.send_chat_message("Hola, ya funciono!").await;
    set_timer(twitch_bot.clone(), "Hola mundo!".to_string(), 5000);
    // twitch_bot.clone().read_chat(reader);

    twitch_bot.read_chat().await;
    tokio::signal::ctrl_c().await.unwrap();
    Ok(())
}
