import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const api_port = process.env.API_PORT;
const webserver_ip = process.env.WEBSERVER_IP;
const webserver_port = process.env.WEBSERVER_PORT;
app.use('/send', express.urlencoded({ extended: true }));

// Sets up multer's storage location
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './tmp/uploads');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});
const upload = multer({ storage: storage });

// This section handles the main report submission
app.post('/send', upload.single('imageUpload'), (req, res) => {
	if (req.file) {
		console.log(req.body);

		res.redirect(`http://${webserver_ip}:${webserver_port}`);
	} else {
		res.status(400).send('Please upload a valid image');
	}
});

app.listen(api_port, () => {
	console.log(`API running on port ${api_port}`);
});
