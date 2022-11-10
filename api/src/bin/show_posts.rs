use self::models::*;
use diesel::prelude::*;
use rust_api::*;

fn main() {
    use self::schema::posts::dsl::*;

    let connection = &mut establish_connection();
    let result = posts
        .filter(published.eq(true))
        .limit(5).load::<Post>(connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", result.len());
    for post in result {
        println!("{}", post.title);
        println!("-----------\n");
        println!("{}", post.body);
    }
}