use rocket::{post, launch, routes};

#[post("/send")]
fn send() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![send])
}