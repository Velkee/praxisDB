CREATE SEQUENCE admin_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."admin" (
    "id" integer DEFAULT nextval('admin_id_seq') NOT NULL,
    "username" text NOT NULL,
    "passwordhash" text NOT NULL,
    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE check_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."check" (
    "id" integer DEFAULT nextval('check_id_seq') NOT NULL,
    "company_id" integer NOT NULL,
    "timestamp" timestamp NOT NULL,
    "responded" boolean NOT NULL,
    "accepted" boolean NOT NULL,
    "admin_id" integer,
    "proof" text NOT NULL,
    CONSTRAINT "check_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."company" (
    "id" integer NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."check" ADD CONSTRAINT "check_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES admin(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."check" ADD CONSTRAINT "check_company_id_fkey" FOREIGN KEY (company_id) REFERENCES company(id) NOT DEFERRABLE;