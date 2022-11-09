import express from 'express';
const app = express();

app.get('/', (_request, response) => {
	response.send('API is online: hello world!');
});

app.listen(8000, () => {
	console.log('API running on port 8000');
});
