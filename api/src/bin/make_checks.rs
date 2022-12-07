use chrono::NaiveDate;
use rust_api::*;
use std::io::stdin;

fn main() {
    let connection = &mut establish_connection();

    let mut company = String::new();
    let mut year = String::new();
    let mut month = String::new();
    let mut day = String::new();
    let answer = false;
    let response = false;

    println!("What company was checked? (Use company ID/ORGNUM)");
    stdin().read_line(&mut company).unwrap();
    let company = company.trim().parse().expect("Input not an integer");

    println!("What year was the company checked?");
    stdin().read_line(&mut year).unwrap();
    let year = year.trim().parse().expect("Input not an integer");

    println!("What month was the company checked? (Use month number)");
    stdin().read_line(&mut month).unwrap();
    let month = month.trim().parse().expect("Input not an integer");

    println!("What day was the company checked? (Use day number)");
    stdin().read_line(&mut day).unwrap();
    let day = day.trim().parse().expect("Input not an integer");

    let date = NaiveDate::from_ymd_opt(year, month, day).expect("Could not parse date");

    println!("Did the company respond?");

    let _check = create_check(connection, &company, &date, &answer, &response);
}