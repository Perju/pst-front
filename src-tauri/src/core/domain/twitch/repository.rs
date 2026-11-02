use async_trait::async_trait;
use crate::core::domain::twitch::entity::Command;

#[async_trait]
pub trait CommandRepository: Send + Sync {
    async fn get_all(&self) -> Result<Vec<Command>, String>;
    async fn get_by_id(&self, id: i32) -> Result<Option<Command>, String>;
    async fn save(&self, command: Command) -> Result<Command, String>;
    async fn delete(&self, id: i32) -> Result<(), String>;
}
