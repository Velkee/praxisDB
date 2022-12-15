import express from 'express';
const app = express();
const port = 23450;

app.use("/send", express.urlencoded({ extended: true }));


app.post('/send', (req, res) => {
    const body = (req.body)
    console.log(body)
    res.redirect('http://localhost:8080')
})

app.listen(port, () => {
    console.log(`API running on port ${port}`);
})