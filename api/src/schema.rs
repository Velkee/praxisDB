// @generated automatically by Diesel CLI.

diesel::table! {
    checks (id) {
        id -> Int4,
        company -> Int4,
        date -> Date,
        answer -> Bool,
        response -> Bool,
    }
}

diesel::table! {
    companies (id) {
        id -> Int4,
        name -> Text,
        subject -> Int4,
    }
}

diesel::table! {
    subjects (id) {
        id -> Int4,
        name -> Text,
    }
}

diesel::joinable!(checks -> companies (company));
diesel::joinable!(companies -> subjects (subject));

diesel::allow_tables_to_appear_in_same_query!(
    checks,
    companies,
    subjects,
);
