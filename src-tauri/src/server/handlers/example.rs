use actix_web::get;

#[get("/api/test")]
pub async fn handle() -> actix_web::Result<String> {
    let text = "Hello world";
    println!("{}", text);

    Ok(text.to_string())
}
