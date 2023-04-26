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

async function validateCookie(key?: string): Promise<number | undefined> {
	if (key == undefined) {
		return undefined;
	}

	const admin = await prisma.session.findUnique({ where: { key: key } });
	return admin?.id;
}

async function checkExpired() {
	const currentDate = new Date();
	await prisma.session.deleteMany({ where: { expires: currentDate } });
}

checkExpired();

// Sets up multer's storage location

let uniqueSuffix: string;

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, './uploads');
	},
	filename: (_req, file, cb) => {
		const extArray = file.mimetype.split('/');
		const extension = extArray[extArray.length - 1];
		uniqueSuffix =
			Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + extension;
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
	const fetchAdmins = await prisma.admin.findMany({
		orderBy: { username: 'asc' },
		select: { id: true, username: true },
	});

	if (fetchAdmins.length == 0) {
		return res.status(500).send('No admins were found');
	}

	res.send(fetchAdmins);
});

app.get('/files/:suffix', (req, res) => {
	res.sendFile(
		process.cwd() + '/uploads/imageUpload-' + req.params.suffix,
		(err) => {
			if (err) res.status(404).send('Image could not be found');
		}
	);
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

app.get('/submissions/:submission', async (req, res) => {
	const submissionId = parseInt(req.params.submission);

	const fetchSubmission = await prisma.checked.findUnique({
		where: { id: submissionId },
		include: {
			company: { select: { name: true, subjects: { select: { name: true } } } },
			admin: { select: { username: true } },
		},
	});

	res.send(fetchSubmission);
});

app.post('/submit', upload.single('imageUpload'), async (req, res) => {
	const submission: {
		companyName: string;
		companyId: string;
		subject: string;
		responded?: boolean;
		accepted?: boolean;
	} = req.body;

	console.log(req.body);

	submission.responded = !!submission.responded;
	submission.accepted = !!submission.accepted;

	if (!req.file) {
		return res.status(400).send('Please upload a valid image');
	}

	let companyCheck = await prisma.company.findUnique({
		where: { id: parseInt(submission.companyId) },
	});

	if (companyCheck == null) {
		await prisma.company.create({
			data: {
				id: parseInt(submission.companyId),
				name: submission.companyName,
			},
		});

		companyCheck = await prisma.company.findUnique({
			where: { id: parseInt(submission.companyId) },
		});
	}

	const checkLink = await prisma.company.findFirst({
		where: { subjects: { some: { id: parseInt(submission.subject) } } },
		select: { _count: true },
	});

	if (checkLink == null) {
		await prisma.company.update({
			where: { id: parseInt(submission.companyId) },
			data: { subjects: { connect: { id: parseInt(submission.subject) } } },
		});
	}

	await prisma.checked.create({
		data: {
			company: { connect: { id: parseInt(submission.companyId) } },
			responded: submission.responded,
			accepted: submission.accepted,
			proof: uniqueSuffix,
			date: new Date(),
		},
	});

	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.get('/isloggedin', async (req, res) => {
	if ((await validateCookie(req.cookies.adminKey)) === undefined) {
		return res.status(401).send('Valid cookie not found');
	}
	res.status(200).send();
});

app.post('/admin/login', upload.none(), async (req, res) => {
	const login: { adminUsername?: string; adminPassword?: string } = req.body;

	if (login.adminUsername === undefined || login.adminPassword === undefined) {
		return res.status(400).send('No username/password provided');
	}

	const matchingAdmin = await prisma.admin.findUnique({
		where: { username: login.adminUsername },
	});

	if (matchingAdmin === null) {
		return res.status(401).send('Your username or/and password is incorrect');
	}

	const compare = await bcrypt.compare(
		login.adminPassword,
		matchingAdmin.passwordhash
	);

	if (!compare) {
		return res.status(401).send('Your username or/and password is incorrect');
	}

	let key: string;

	const session = await prisma.session.findUnique({
		where: { admin_id: matchingAdmin.id },
	});

	if (session == null) {
		key = crypto.randomBytes(32).toString('hex');
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + 30);

		await prisma.session.create({
			data: {
				key: key,
				expires: expiryDate,
				admin_id: matchingAdmin.id,
			},
		});
	} else {
		key = session.key;
	}

	res
		.cookie('adminKey', key, { httpOnly: true, sameSite: true })
		.redirect(`http://${webserver_ip}:${webserver_port}/admin`);
});

app.post('/newadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const info: { adminUsername?: string; adminPassword?: string } = req.body;
	const saltRounds = 10;

	if (info.adminUsername === undefined || info.adminPassword === undefined) {
		return res
			.status(400)
			.send(
				'Username or password not provided. If you are seeing this you broke something'
			);
	}

	const query = await prisma.admin.findUnique({
		where: { username: info.adminUsername },
	});

	if (query != null) {
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

	const update: { oldPassword?: string; newPassword?: string } = req.body;
	const saltRounds = 10;

	if (update.oldPassword === undefined || update.newPassword === undefined) {
		return res
			.status(400)
			.send(
				'One of the fields are missing. If you are reading this, please stop'
			);
	}

	const hash = await bcrypt.hash(update.newPassword, saltRounds);

	const idFromSession = await prisma.session.findUnique({
		where: { key: req.cookies.adminKey },
		select: { admin_id: true },
	});

	if (idFromSession == null) {
		return res.status(500).send('The admin_id could not be determined');
	}

	await prisma.admin.update({
		where: { id: idFromSession.admin_id },
		data: { passwordhash: hash },
	});

	res.clearCookie('adminKey');
	res.redirect(`http://${webserver_ip}:${webserver_port}/admin/editor`);
});

app.post('/deleteadmin', upload.none(), async (req, res) => {
	if (!(await validateCookie(req.cookies.adminKey))) {
		return res.status(401).send('Valid cookie not found');
	}

	const update: { adminId: string; warning: boolean } = req.body;
	const parsedId = parseInt(update.adminId);
	update.warning = !!update.warning;

	await prisma.admin.delete({ where: { id: parsedId } });

	res.redirect(`http://${webserver_ip}:${webserver_port}/admin/editor`);
});

app.get('/logout', upload.none(), (_req, res) => {
	res.clearCookie('adminKey');
	res.redirect(`http://${webserver_ip}:${webserver_port}`);
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});

setInterval(async () => {
	await checkExpired();
}, 43200000);
