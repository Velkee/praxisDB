import express from 'express';
import multer from 'multer';

const app = express();
const port = 23450;
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
		res.redirect('http://localhost:8080');
	} else {
		res.status(400).send('Please upload a valid image');
	}
});

app.listen(port, () => {
	console.log(`API running on port ${port}`);
});
