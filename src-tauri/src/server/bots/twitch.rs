use std::marker::Copy;
use std::error::Error;
use std::env;
use dotenv::dotenv;

use tokio::net::TcpStream;
use tokio::io::{AsyncWriteExt, BufReader, AsyncBufReadExt};

use reqwest::Client;

use twitch_api::{helix, HelixClient};
use twitch_api::twitch_oauth2::{ AccessToken, AppAccessToken, TwitchToken, UserToken};
use twitch_api::{helix::channels::GetChannelInformationRequest, TwitchClient};
use twitch_api::helix::chat;


pub struct TwitchBotApp {
    client: TwitchClient<'static, reqwest::Client>,
    app_token: AppAccessToken,
    helix_client: HelixClient<'static, reqwest::Client>,
    chat_token: UserToken,
    chat_username: String,
    chat_channel_id: String,
}

impl TwitchBotApp {
    async fn new() -> Self {
        dotenv().ok();
        let tkn_client_id = std::env::var("TKN_CLIENT_ID").unwrap();
        let tkn_client_secret = std::env::var("TKN_CLIENT_SECRET").unwrap();
        let tkn_bot = std::env::var("TKN_BOT").unwrap();
        let client = TwitchClient::default();
        let http_client = Client::new();
        let helix_client = HelixClient::with_client(http_client.clone());
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

        TwitchBotApp {
            client,
            helix_client,
            app_token,
            chat_token,
            chat_username,
            chat_channel_id,
        }
    }
    pub async fn send_chat_message(&self, message: &str) -> Result<(), Box<dyn Error>>  {
        // Conectar al servidor IRC de Twitch
        let stream = TcpStream::connect("irc.chat.twitch.tv:6667").await?;
        let (read, mut write) = stream.into_split();
        let mut reader = BufReader::new(read).lines();

        // Autenticarse
        write.write_all(format!("PASS oauth:{}\r\n", self.chat_token.token().secret()).as_bytes()).await?;
        write.write_all(format!("NICK {}\r\n", self.chat_username).as_bytes()).await?;

        // Unirse al canal
        write.write_all(format!("JOIN #{}\r\n", self.chat_channel_id).as_bytes()).await?;

        // Enviar un mensaje al chat
        write.write_all(format!("PRIVMSG #{} :{}\r\n", self.chat_channel_id, message).as_bytes()).await?;
        println!("Mensaje enviado: {}", message);

        // Leer las respuestas del servidor (opcional)
        while let Some(line) = reader.next_line().await? {
            println!("Recibido: {}", line);
            if line.contains("End of /NAMES list") {
                break;
            }
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

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    let twitch_bot: TwitchBotApp = TwitchBotApp::new().await;

    twitch_bot.get_channel_info().await;
    twitch_bot.send_chat_message("Hola mundo!").await;
    Ok(())
}

