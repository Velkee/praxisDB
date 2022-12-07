use self::models::*;
use diesel::prelude::*;
use rust_api::*;

fn main() {
    use self::schema::checks::dsl::*;

    let connection = &mut establish_connection();
    let results = checks
        .load::<Check>(connection)
        .expect("Error loading checks");

        for check in results {
            println!("{}", check.id);
            println!("{}", check.company);
            println!("{}", check.date);
            println!("{}", check.answer);
            println!("{}", check.response);
        }
}