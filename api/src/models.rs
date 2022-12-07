use crate::schema::*;
use chrono::NaiveDate;
use diesel::prelude::*;


#[derive(Queryable)]
pub struct Company {
    pub id: i32,
    pub name: String,
    pub subject: i32,
}

#[derive(Queryable)]
pub struct Subject {
    pub id: i32,
    pub name: String,
}

#[derive(Queryable)]
pub struct Check {
    pub id: i32,
    pub company: i32,
    pub date: NaiveDate,
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

#[derive(Insertable)]
#[diesel(table_name = subjects)]
pub struct NewSubject<'a> {
    pub name: &'a str,
}

#[derive(Insertable)]
#[diesel(table_name = checks)]
pub struct NewCheck<'a> {
    pub company: &'a i32,
    pub date: &'a NaiveDate,
    pub answer: &'a bool,
    pub response: &'a bool,
}