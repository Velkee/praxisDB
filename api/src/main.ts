import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import cookieparser from 'cookie-parser';
import crypto from 'crypto';

dotenv.config();
const api_port = process.env.API_PORT ?? 23450;
const webserver_ip = process.env.WEBSERVER_IP ?? '0.0.0.0';
const webserver_port = process.env.WEBSERVER_PORT ?? 80;

const client = new pg.Client();
await client.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

async function validateCookie(key: string): Promise<number | undefined> {
	const query = await client.query({
		text: 'SELECT admin_id FROM session WHERE key=$1',
		values: [key],
	});

	return query.rows[0]?.admin_id;
}

// Sets up multer's storage location

let uniqueSuffix: string;

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, './tmp/uploads');
	},
	filename: (_req, file, cb) => {
		uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});
const upload = multer({ storage: storage });

app.post('/submit', upload.single('imageUpload'), async (req, res) => {
	const submission: {
		buissenessName: string;
		buissenessNr: number;
		subject: string;
		responded?: boolean;
		accepted?: boolean;
	} = req.body;

	submission.responded = !!submission.responded;
	submission.accepted = !!submission.accepted;

	console.log(submission);

	if (!req.file) {
		return res.status(400).send('Please upload a valid image');
	}

	const companyCheck = await client.query({
		text: 'SELECT id FROM company WHERE id = $1',
		values: [submission.buissenessNr],
	});

	let subjectCheck = await client.query({
		text: 'SELECT id FROM subject WHERE name = $1',
		values: [submission.subject],
	});

	if (!subjectCheck.rows[0]) {
		client.query({
			text: 'INSERT INTO subject (name) VALUES ($1)',
			values: [submission.subject],
		});
	}

	subjectCheck = await client.query({
		text: 'SELECT id FROM subject WHERE name = $1',
		values: [submission.subject],
	});

	if (!companyCheck.rows[0]) {
		client.query({
			text: 'INSERT INTO company (id, name, subject_id) VALUES ($1, $2, $3)',
			values: [
				submission.buissenessNr,
				submission.buissenessName.toUpperCase(),
				subjectCheck.rows[0].id,
			],
		});
	}

	client.query({
		text: 'INSERT INTO checked (company_id, timestamp, responded, accepted, proof) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)',
		values: [
			submission.buissenessNr,
			submission.responded,
			submission.accepted,
			uniqueSuffix,
		],
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.post('/admin/login', upload.none(), async (req, res) => {
	const login: { username: string; password: string } = req.body;

	const matchingAdmin = await client.query({
		text: 'SELECT id, username, passwordhash FROM admin WHERE username = $1',
		values: [login.username],
	});

	if (matchingAdmin.rowCount === 0) {
		return res.status(400).send('Your username or/and password is incorrect');
	}

	const compare = await bcrypt.compare(
		login.password,
		matchingAdmin.rows[0].passwordhash
	);

	if (!compare) {
		return res.status(400).send('Your username or/and password is incorrect');
	}

	let key: string;

	const checkCookie = await client.query({
		text: 'SELECT key, admin_id FROM session WHERE admin_id = $1',
		values: [matchingAdmin.rows[0].id],
	});

	if (checkCookie.rowCount === 0) {
		key = crypto.randomBytes(32).toString('hex');
		client.query({
			text: 'INSERT INTO session (key, admin_id) VALUES ($1, $2)',
			values: [key, matchingAdmin.rows[0].id],
		});
	} else {
		key = checkCookie.rows[0].key;
	}

	res.cookie('adminKey', key, { httpOnly: true, sameSite: true });
	res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.get('/isloggedin', async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}
	res.status(200);
});

app.post('/newadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const info: { username: string; password: string } = req.body;
	const saltRounds = 10;

	const query = await client.query({
		text: 'SELECT username FROM admin WHERE username = $1',
		values: [info.username],
	});

	if (query.rows[0]) {
		return res.status(409).send('User with that username already exists');
	}

	const hash = await bcrypt.hash(info.password, saltRounds);

	await client.query({
		text: 'INSERT INTO admin(username, passwordhash) VALUES ($1, $2)',
		values: [info.username, hash],
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});
