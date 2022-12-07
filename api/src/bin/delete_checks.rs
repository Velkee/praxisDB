use diesel::prelude::*;
use praxisdb_api::*;
use std::env::args;

fn main() {
    use self::schema::checks::dsl::*;

    let target_string = args().nth(1).expect("Expected a target to match against");
    let target = target_string.parse::<i32>().unwrap();

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(checks.filter(id.eq(target)))
        .execute(connection)
        .expect("Error deleting posts");

    println!("Deleted {} checks", num_deleted);
}
