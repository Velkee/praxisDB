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

if ((await prisma.admin.count()) == 0) {
	const salt = 10;
	const hash = await bcrypt.hash('changeme', salt);

	await prisma.admin.create({
		data: { username: 'admin', passwordhash: hash },
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
	const fetchSubjects = await prisma.subject.findMany({
		orderBy: { name: 'asc' },
	});

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
	const fetchSubmissions = await prisma.checked.findMany({
		orderBy: { company: { name: 'asc' } },

		include: {
			company: {
				select: { name: true, subjects: { select: { name: true } } },
			},
			admin: { select: { username: true } },
		},
	});

	res.send(fetchSubmissions);
});

app.post('/submit', upload.single('imageUpload'), async (req, res) => {
	const submission: {
		buissenessName: string;
		buissenessNr: string;
		subject: string;
		responded?: boolean;
		accepted?: boolean;
	} = req.body;

	submission.responded = !!submission.responded;
	submission.accepted = !!submission.accepted;

	if (!req.file) {
		return res.status(400).send('Please upload a valid image');
	}

	let companyCheck = await prisma.company.findMany({
		where: { id: parseInt(submission.buissenessNr) },
	});

	if (companyCheck.length == 0) {
		await prisma.company.create({
			data: {
				id: parseInt(submission.buissenessNr),
				name: submission.buissenessName,
			},
		});

		companyCheck = await prisma.company.findMany({
			where: { id: parseInt(submission.buissenessNr) },
		});
	}

	const checkLink = await prisma.company.findMany({
		where: { subjects: { some: { id: parseInt(submission.subject) } } },
		select: { _count: true },
	});

	if (checkLink.length == 0) {
		await prisma.company.update({
			where: { id: parseInt(submission.buissenessNr) },
			data: { subjects: { connect: { id: parseInt(submission.subject) } } },
		});
	}

	await prisma.checked.create({
		data: {
			company: { connect: { id: parseInt(submission.buissenessNr) } },
			responded: submission.responded,
			accepted: submission.accepted,
			proof: uniqueSuffix,
			timestamp: new Date(),
		},
	});

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

	const matchingAdmin = await prisma.admin.findMany({
		where: { username: login.adminUsername },
	});

	if (matchingAdmin.length == 0) {
		return res.status(400).send('Your username or/and password is incorrect');
	}

	const compare = await bcrypt.compare(
		login.adminPassword,
		matchingAdmin[0].passwordhash
	);

	if (!compare) {
		return res.status(400).send('Your password is incorrect');
	}

	let key: string;

	const checkCookie = await prisma.session.findMany({
		where: { admin_id: matchingAdmin[0].id },
	});

	if (checkCookie.length == 0) {
		key = crypto.randomBytes(32).toString('hex');
		await prisma.session.create({
			data: { key: key, admin_id: matchingAdmin[0].id },
		});
	} else {
		key = checkCookie[0].key;
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

	const query = await prisma.admin.findMany({
		where: { username: info.adminUsername },
	});

	if (query.length != 0) {
		return res.status(409).send('User with that username already exists');
	}

	const hash = await bcrypt.hash(info.adminPassword, saltRounds);

	await prisma.admin.create({
		data: { username: info.adminUsername, passwordhash: hash },
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.post('/editadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const update: { oldPassword: string; newPassword: string } = req.body;
	const saltRounds = 10;

	const hash = await bcrypt.hash(update.newPassword, saltRounds);
	const idFromSession = await prisma.session.findMany({
		where: { key: req.cookies.adminKey },
		select: { admin_id: true },
	});

	await prisma.admin.update({
		where: { id: idFromSession[0].admin_id },
		data: { passwordhash: hash },
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

	await prisma.admin.delete({ where: { id: update.adminId } });

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin/editor`);
});

app.get('/logout', upload.none(), (_req, res) => {
	res.clearCookie('adminKey');
	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});
