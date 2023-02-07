import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();
const api_port = process.env.API_PORT;
const webserver_ip = process.env.WEBSERVER_IP;
const webserver_port = process.env.WEBSERVER_PORT;

const client = new pg.Client();
await client.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));

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
	if (req.file) {
		console.log(req.body);
		res.redirect(`http://${webserver_ip}:${webserver_port}`);
	} else {
		res.status(400).send('Please upload a valid image');
	}
});

// Login
// app.post('/admin/login', upload.none(), async (req, res) => {
// 	const login: { username: string; password: string } = req.body;

// 	const query = await client.query({
// 		text: 'SELECT username, passwordhash FROM admin WHERE username = $1',
// 		values: [login.username],
// 	});
// });

app.post('/newadmin', upload.none(), async (req, res) => {
	const info: { username: string; password: string } = req.body;
	const saltRounds = 10;

	const query = await client.query({
		text: 'SELECT username FROM admin WHERE username = $1',
		values: [info.username],
	});

	if (query.rows[0] === undefined) {
		const hash = await bcrypt.hash(info.password, saltRounds);

		await client.query({
			text: 'INSERT INTO admin(username, passwordhash) VALUES ($1, $2)',
			values: [info.username, hash],
		});

		res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
	} else {
		res.status(409).send('User with that username already exists');
	}
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});
