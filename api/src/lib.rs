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
