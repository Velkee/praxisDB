use rust_api::*;
use std::io::stdin;

fn main() {
    let connection = &mut establish_connection();

    let mut id_input = String::new();
    let mut name = String::new();
    let mut subject_input = String::new();

    println!("What is the company's ORGNUM");
    stdin().read_line(&mut id_input).unwrap();
    let id = id_input.trim().parse().expect("Input not an integer");

    println!("What is the company's name?");
    stdin().read_line(&mut name).unwrap();
    let name = name.trim_end();

    println!("What is the company's subject?");
    stdin().read_line(&mut subject_input).unwrap();
    let subject = subject_input.trim().parse().expect("Input not an integer");

    let _company = create_company(connection, &id, &name, &subject);
    println!("\nSaved company {} with orgnum of {}", name, id);
}
