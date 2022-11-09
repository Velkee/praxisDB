import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

const pgp = require('pg-promise')();

const cn = {
	host: '172.22.0.2',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
};

const db = pgp({
	host: '172.22.0.2',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
});

db.any('SELECT * FROM subject')
	.then(function (data: any) {
		console.log('DATA:', data);
	})
	.catch(function (error: any) {
		console.log('ERROR:', error);
	});

/* app.get('/', (_request, response) => {
	response.send('API is online: hello world!');
});

app.listen(8000, () => {
	console.log('API running on port 8000');
});
*/
