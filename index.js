const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

// mongodb start
// connect mongodb
const uri = process.env.DB_USER;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// mongodb connected
// mongodb end

// middleware end
app.get('/', (req, res) => {
    res.send('Server connected')
})
app.listen(port, () => {
    client.connect(err => {
        if(err){
            console.log(err);
        }else{
            console.log("Mongodb connected")
        }
    });
    console.log('Server connected', process.env.PORT)
})
