use chrono::NaiveDate;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub mod models;
pub mod schema;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

use self::models::{Company, NewCompany};

pub fn create_company(conn: &mut PgConnection, id: &i32, name: &str, subject: &i32) -> Company {
    use crate::schema::companies;

    let new_company = NewCompany { id, name, subject };

    diesel::insert_into(companies::table)
        .values(&new_company)
        .get_result(conn)
        .expect("Error saving new company")
}

use self::models::{Subject, NewSubject};

pub fn create_subject(conn: &mut PgConnection, name: &str) -> Subject {
    use crate::schema::subjects;

    let new_subject = NewSubject { name };

    diesel::insert_into(subjects::table)
        .values(&new_subject)
        .get_result(conn)
        .expect("Error saving new subject")
}

use self::models::{Check, NewCheck};

pub fn create_check(conn: &mut PgConnection, company: &i32, date: &NaiveDate, answer: &bool, response: &bool) -> Check {
    use crate::schema::checks;

    let new_check = NewCheck { company, date, answer, response };

    diesel::insert_into(checks::table)
        .values(&new_check)
        .get_result(conn)
        .expect("Error saving new check")
}
