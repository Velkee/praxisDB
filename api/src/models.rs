use crate::schema::companies;
use diesel::prelude::*;
use diesel::sql_types::Date;

#[derive(Queryable)]
pub struct Company {
    pub id: i32,
    pub name: String,
    pub subject: i32,
}

pub struct Subject {
    pub id: i32,
    pub name: String,
}

pub struct Checked {
    pub id: i32,
    pub company: i32,
    pub date: Date,
    pub answer: bool,
    pub response: bool,
}

#[derive(Insertable)]
#[diesel(table_name = companies)]
pub struct NewCompany<'a> {
    pub id: &'a i32,
    pub name: &'a str,
    pub subject: &'a i32,
}
