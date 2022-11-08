const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware start
app.use(cors());
app.use(express.json())
// custom middleware start
app.use('*', (req, res, next) => {
    console.log(req.url);
    next()
})
// custom middleware end
// middleware end
app.get('/', (req, res) => {
    res.send('Server connected')
})
app.listen(port, () => {
    console.log('Server connected')
})
