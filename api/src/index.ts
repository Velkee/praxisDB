import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';

const prisma = new PrismaClient();

if ((await prisma.subject.count()) == 0) {
	const subject: string[] = JSON.parse(fs.readFileSync('./init.json', 'utf-8'));

	await prisma.subject.createMany({
		data: subject.map((x) => {
			return { name: x };
		}),
	});
}

dotenv.config();
const api_port = process.env.API_PORT ?? 23450;
const webserver_ip = process.env.WEBSERVER_IP ?? '0.0.0.0';
const webserver_port = process.env.WEBSERVER_PORT ?? 80;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors());

async function validateCookie(key: string): Promise<number | undefined> {
	const admin = await prisma.session.findFirst({ where: { key: key } });
	return admin?.id;
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

app.get('/subjects', async (_req, res) => {
	const fetchSubjects = await prisma.subject.findMany();

	if (fetchSubjects.length == 0) {
		return res.status(500).send('No subjects were found');
	}

	res.send(fetchSubjects);
});

app.get('/admins', async (_req, res) => {
	const fetchAdmins = await prisma.admin.findMany();

	if (fetchAdmins.length == 0) {
		return res.status(500).send('No admins were found');
	}

	res.send(fetchAdmins);
});

app.get('/submissions', async (_req, res) => {
	const fetchSubmissions = await client.query({
		text: 'SELECT checked.company_id, company.name AS company_name, company_has_subject.subject_id, subject.name AS subject_name, checked.timestamp, checked.responded, checked.accepted, checked.admin_id, checked.proof, admin.username AS admin_username FROM checked LEFT JOIN admin ON checked.admin_id = admin.id INNER JOIN company ON checked.company_id = company.id INNER JOIN company_has_subject ON company.id = company_has_subject.company_id INNER JOIN subject ON company_has_subject.subject_id = subject.id',
	});

	if (fetchSubmissions.rowCount === 0) {
		return res.status(404).send('No checks in the database');
	}

	res.send(fetchSubmissions.rows);
});

app.post('/submit', upload.single('imageUpload'), async (req, res) => {
	const submission: {
		buissenessName: string;
		buissenessNr: number;
		subject: number;
		responded?: boolean;
		accepted?: boolean;
	} = req.body;

	submission.responded = !!submission.responded;
	submission.accepted = !!submission.accepted;

	if (!req.file) {
		return res.status(400).send('Please upload a valid image');
	}

	let companyCheck = await prisma.company.findMany({
		where: { id: submission.buissenessNr },
	});

	if (companyCheck.length == 0) {
		await prisma.company.create({
			data: { id: submission.buissenessNr, name: submission.buissenessName },
		});

		companyCheck = await prisma.company.findMany({
			where: { id: submission.buissenessNr },
		});
	}

	const checkLink = await prisma.company.findMany({
		where: { subjects: { some: { id: submission.subject } } },
		select: { _count: true },
	});

	if (checkLink.length == 0) {
		await prisma.company.update({
			where: { id: submission.buissenessNr },
			data: { subjects: { connect: { id: submission.subject } } },
		});
	}

	await prisma.checked.create({
		data: {
			company_id: submission.buissenessNr,
			responded: submission.responded,
			accepted: submission.accepted,
			proof: uniqueSuffix,
		},
	});
	// await client.query({
	// 	text: 'INSERT INTO checked (company_id, timestamp, responded, accepted, proof) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)',
	// 	values: [
	// 		submission.buissenessNr,
	// 		submission.responded,
	// 		submission.accepted,
	// 		uniqueSuffix,
	// 	],
	// });

	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.get('/isloggedin', async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}
	res.status(200).send();
});

app.post('/admin/login', upload.none(), async (req, res) => {
	const login: { adminUsername: string; adminPassword: string } = req.body;

	const matchingAdmin = await client.query({
		text: 'SELECT id, username, passwordhash FROM admin WHERE username = $1',
		values: [login.adminUsername],
	});

	if (matchingAdmin.rowCount === 0) {
		return res.status(400).send('Your username or/and password is incorrect');
	}

	const compare = await bcrypt.compare(
		login.adminPassword,
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
		await client.query({
			text: 'INSERT INTO session (key, admin_id) VALUES ($1, $2)',
			values: [key, matchingAdmin.rows[0].id],
		});
	} else {
		key = checkCookie.rows[0].key;
	}

	res.cookie('adminKey', key, { httpOnly: true, sameSite: true });
	res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.post('/newadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const info: { adminUsername: string; adminPassword: string } = req.body;
	const saltRounds = 10;

	const query = await client.query({
		text: 'SELECT username FROM admin WHERE username = $1',
		values: [info.adminUsername],
	});

	if (query.rows[0]) {
		return res.status(409).send('User with that username already exists');
	}

	const hash = await bcrypt.hash(info.adminPassword, saltRounds);

	await client.query({
		text: 'INSERT INTO admin(username, passwordhash) VALUES ($1, $2)',
		values: [info.adminUsername, hash],
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.post('/editadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const update: { adminId: number; newPassword: string } = req.body;
	const saltRounds = 10;

	const hash = await bcrypt.hash(update.newPassword, saltRounds);

	await client.query({
		text: 'UPDATE admin SET passwordhash = $1 WHERE id = $2',
		values: [hash, update.adminId],
	});

	res.clearCookie('adminKey');
	res.redirect(`http://${webserver_ip}:${webserver_port}/admin/editor`);
});

app.post('/deleteadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const update: { adminId: number; warning: boolean } = req.body;

	update.warning = !!update.warning;

	await client.query({
		text: 'DELETE FROM admin WHERE id = $1',
		values: [update.adminId],
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin/editor`);
});

app.get('/logout', upload.none(), (_req, res) => {
	res.clearCookie('adminKey');
	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});
