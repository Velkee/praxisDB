use self::models::*;
use diesel::prelude::*;
use rust_api::*;

fn main() {
    use self::schema::subjects::dsl::*;

    let connection = &mut establish_connection();
    let results = subjects
        .load::<Subject>(connection)
        .expect("Error loading subjects");

    for subject in results {
        println!("{}", subject.id);
        println!("{}", subject.name);
    }
}