import express from 'express';
const app = express();
const port = 23450;

app.post('/send')

app.listen(port, () => {
    console.log('API running on port $(port)');
})