use diesel::prelude::*;
use rust_api::*;
use std::env::args;

fn main() {
    use self::schema::companies::dsl::*;

    let target = args().nth(1).expect("Expected a target to match against");
    let pattern = format!("%{}%", target);

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(companies.filter(name.like(pattern)))
        .execute(connection)
        .expect("Error deleting posts");

    println!("Deleted {} companies", num_deleted);
}
