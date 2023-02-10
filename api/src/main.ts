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
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, './tmp/uploads');
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});
const upload = multer({ storage: storage });

app.post('/submit', upload.single('imageUpload'), (req, res) => {
	if (!req.file) {
		return res.status(400).send('Please upload a valid image');
	}

	console.log(req.body);
	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.post('/admin/login', upload.none(), async (req, res) => {
	const login: { username: string; password: string } = req.body;

	const query = await client.query({
		text: 'SELECT id, username, passwordhash FROM admin WHERE username = $1',
		values: [login.username],
	});

	if (query.rowCount === 0) {
		return res.status(400).send('Invalid login');
	}

	const compare = await bcrypt.compare(
		login.password,
		query.rows[0].passwordhash
	);

	if (!compare) return;

	const key = crypto.randomBytes(32).toString('hex');

	client.query({
		text: 'INSERT INTO session (key, admin_id) VALUES ($1, $2)',
		values: [key, query.rows[0].id],
	});

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
