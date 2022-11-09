#[macro_use] extern crate rocket;

#[get("/api")]
fn api() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![api])
}