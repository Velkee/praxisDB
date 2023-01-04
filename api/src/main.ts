import express from 'express';
import multer from 'multer';
const app = express();
const port = 23450;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/tmp/uploads');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});

const upload = multer({ storage: storage });

app.use('/send', express.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
	const body = req.body;
	console.log(body);
	res.redirect('http://localhost:8080');
});

app.listen(port, () => {
	console.log(`API running on port ${port}`);
});
