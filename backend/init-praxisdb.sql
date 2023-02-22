CREATE SEQUENCE admin_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."admin" (
    "id" integer DEFAULT nextval('admin_id_seq') NOT NULL,
    "username" text NOT NULL,
    "passwordhash" text NOT NULL,
    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE checked_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."checked" (
    "id" integer DEFAULT nextval('checked_id_seq') NOT NULL,
    "company_id" integer NOT NULL,
    "timestamp" timestamptz NOT NULL,
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


CREATE TABLE "public"."company_has_subject" (
    "company_id" integer NOT NULL,
    "subject_id" integer NOT NULL,
    CONSTRAINT "company_has_subject_pkey" PRIMARY KEY ("company_id", "subject_id")
) WITH (oids = false);


CREATE SEQUENCE session_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."session" (
    "id" integer DEFAULT nextval('session_id_seq') NOT NULL,
    "key" text NOT NULL,
    "admin_id" integer NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE subject_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."subject" (
    "id" integer DEFAULT nextval('subject_id_seq') NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "subject" ("id", "name") VALUES
(1,	'Bygg- og anleggsteknikk'),
(2,	'Anleggsgartner'),
(3,	'Anleggsteknikk'),
(4,	'Betong og mur'),
(5,	'Klima, energi og miljøteknikk'),
(6,	'Overflateteknikk'),
(7,	'Rørlegger'),
(8,	'Trearbeid'),
(9,	'Treteknikk'),
(10,	'Tømrer'),
(11,	'Elektro og datateknologi'),
(12,	'Arbeidsmaskiner'),
(13,	'Automatisering'),
(14,	'Brønnteknikk'),
(15,	'Datateknologi og elektronikk'),
(16,	'Drone'),
(17,	'Elenergi og ekom'),
(18,	'Flyfag'),
(19,	'Industriteknologi'),
(20,	'Kjemiprosess- og laboratoriefag'),
(21,	'Kjøretøy'),
(22,	'Kulde-, varmepumpe- og ventilasjonsteknikk'),
(23,	'Maritime fag'),
(24,	'Urmaker'),
(30,	'Aktivitør'),
(31,	'Ambulansefag'),
(32,	'Barne- og ungdomsarbeiderfag'),
(33,	'Fotterapi og ortopediteknikk'),
(34,	'Helsearbeiderfag'),
(35,	'Helseservicefag'),
(36,	'Hudpleie'),
(37,	'Håndverk, design, og produktutvikling'),
(38,	'Båtbygger'),
(39,	'Duodji'),
(25,	'Frisør, blomster, interiør og eksponeringsdesign'),
(26,	'Blomsterdekoratør'),
(27,	'Frisør'),
(28,	'Interiør og eksponeringsdesign'),
(29,	'Helse- og oppvekstfag'),
(40,	'Gull- og sølvsmedhåndtverk'),
(41,	'Smed'),
(42,	'Søm og tekstilhåndverk'),
(43,	'Informasjonsteknologi og medieproduksjon'),
(44,	'Informasjonsteknologi'),
(45,	'Medieproduksjon'),
(46,	'Naturbruk'),
(47,	'Akvakultur'),
(48,	'Fiske og fangst'),
(49,	'Heste- og dyrefag'),
(50,	'Landbruk og gartnernæring'),
(51,	'Reindrift'),
(52,	'Skogbruk'),
(53,	'Restaurant- og matfag'),
(54,	'Baker og konditor'),
(55,	'Kokk- og servitørfag'),
(56,	'Matproduksjon'),
(57,	'Salg, service, og reiseliv'),
(58,	'Salg og reiseliv'),
(59,	'Service, sikkerhet og administrasjon'),
(60,	'Teknologi- og industrifag'),
(61,	'Bilskade, lakk og karosseri'),
(62,	'Børsemaker'),
(63,	'Transport og logistikk');

ALTER TABLE ONLY "public"."checked" ADD CONSTRAINT "checked_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES admin(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
ALTER TABLE ONLY "public"."checked" ADD CONSTRAINT "checked_company_id_fkey" FOREIGN KEY (company_id) REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."company_has_subject" ADD CONSTRAINT "company_has_subject_company_id_fkey" FOREIGN KEY (company_id) REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."company_has_subject" ADD CONSTRAINT "company_has_subject_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES subject(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."session" ADD CONSTRAINT "session_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES admin(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;