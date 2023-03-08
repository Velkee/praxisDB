import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
const pgpassword = process.env.PGPASSWORD;

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: pgpassword,
	database: 'postgres',
});
