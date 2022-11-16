use rust_api::*;
use std::io::stdin;

fn main() {
    let connection = &mut establish_connection();

    let mut name = String::new();

    println!("What is the subject name?");
    stdin().read_line(&mut name).unwrap();
    let name = name.trim_end();

    let _company = create_subject(connection, &name);
    println!("\nSaved subject {}", name);
}
