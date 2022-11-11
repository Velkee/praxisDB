use self::models::*;
use diesel::prelude::*;
use rust_api::*;

fn main() {
    use self::schema::companies::dsl::*;

    let connection = &mut establish_connection();
    let results = companies
        .load::<Company>(connection)
        .expect("Error loading posts");

    for company in results {
        println!("{}", company.id);
        println!("{}", company.name)
    }
}
