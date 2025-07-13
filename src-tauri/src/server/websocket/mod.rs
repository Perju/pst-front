use std::{collections::HashMap, net::SocketAddr, sync::Arc};
use futures::{StreamExt, SinkExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{mpsc, RwLock};
use tokio_tungstenite::{accept_async, tungstenite::Message};
use serde::{Serialize, Deserialize};

type Tx = mpsc::UnboundedSender<Message>;

#[derive(Serialize, Deserialize, Debug)]
struct WsMessage {
    target: String,
    content: String,
    sender: String,
}

#[derive(Default)]
struct PeerMap {
    inner: RwLock<HashMap<String, Tx>>,
}

impl PeerMap {
    async fn broadcast_to(&self, target_id: &str, msg: Message) {
        if let Some(tx) = self.inner.read().await.get(target_id) {
            let _ = tx.send(msg);
        }
    }

    async fn register(&self, id: String, tx: Tx) {
        self.inner.write().await.insert(id, tx);
    }

    async fn unregister(&self, id: &str) {
        self.inner.write().await.remove(id);
    }
}

pub async fn main() {
    env_logger::init();
    let addr = "127.0.0.1:9001";
    let listener = TcpListener::bind(&addr).await.expect("Cannot bind");
    println!("WebSocket server listening on {}", addr);

    let peer_map = Arc::new(PeerMap::default());

    while let Ok((stream, _)) = listener.accept().await {
        let peer_map = peer_map.clone();
        tokio::spawn(handle_connection(peer_map, stream));
    }
}

async fn handle_connection(peer_map: Arc<PeerMap>, stream: TcpStream) {
    let addr = stream.peer_addr().expect("Connected streams should have a peer address");
    let ws_stream = accept_async(stream).await.expect("Error during the websocket handshake");

    println!("New WebSocket connection: {}", addr);

    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
    let (tx, mut rx) = mpsc::unbounded_channel();

    // Aún no sabemos el ID, lo captamos del primer mensaje
    let mut client_id: Option<String> = None;
    let peer_map_clone = peer_map.clone();

    let forward = async {
        while let Some(Ok(msg)) = ws_receiver.next().await {
            if msg.is_text() {
                println!("el mensaje es None? {:?}\n Y client_id es none? {}",msg.to_text().unwrap(), client_id.is_none());
                if let Ok(parsed) = serde_json::from_str::<WsMessage>(msg.to_text().unwrap()) {
                    // Registrar si es la primera vez que recibimos algo del sender
                    if client_id.is_none() {
                        println!("Registering client: {}", parsed.sender);
                        client_id = Some(parsed.sender.clone());
                        peer_map_clone.register(parsed.sender.clone(), tx.clone()).await;
                        println!("Registered client: {}", parsed.sender);
                    }

                    // Reenviar al destinatario
                    peer_map_clone
                        .broadcast_to(&parsed.target, Message::text(msg.to_text().unwrap()))
                        .await;
                } 
            }
        }

        // Unregister al desconectar
        if let Some(id) = &client_id {
            peer_map_clone.unregister(id).await;
            println!("Client {} disconnected", id);
        }
    };

    let backward = async {
        while let Some(msg) = rx.recv().await {
            if ws_sender.send(msg).await.is_err() {
                break;
            }
        }
    };

    tokio::select! {
        _ = forward => {},
        _ = backward => {},
    }

    println!("Connection closed: {}", addr);
}
