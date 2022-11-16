use diesel::prelude::*;
use rust_api::*;
use std::env::args;

fn main() {
    use self::schema::subjects::dsl::*;

    let target_string = args().nth(1).expect("Expected a target to match against");
    let target = target_string.parse::<i32>().unwrap();

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(subjects.filter(id.eq(target)))
        .execute(connection)
        .expect("Error deleting posts");

    println!("Deleted {} subjects", num_deleted);
}
