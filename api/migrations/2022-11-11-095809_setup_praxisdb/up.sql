CREATE TABLE subjects (
    id serial PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE companies (
    id int PRIMARY KEY,
    name text NOT NULL,
    subject int NOT NULL REFERENCES subjects ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE checks (
    id SERIAL PRIMARY KEY,
    company int NOT NULL REFERENCES companies ON DELETE CASCADE ON UPDATE CASCADE,
    date date NOT NULL,
    answer boolean NOT NULL,
    response boolean NOT NULL
);