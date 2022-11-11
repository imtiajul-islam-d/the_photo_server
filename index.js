const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require('jsonwebtoken')
const app = express();
const port = process.env.PORT || 5000;

// middleware start
app.use(cors());
app.use(express.json());
// custom middleware start

  app.post('/jwt', (req, res) => {
    const user = req.body
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.send({token})
    // console.log(user)
  })
  


function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({
      message: "unauthorized access" 
    })
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'unauthorized access'})
    }
    req.decoded = decoded;
    next();
  })
}
// custom middleware end

// mongodb start
// connect mongodb
const uri = process.env.DB_USER;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// mongodb connected
// mongodb end

// middleware end
// main section start
const db = client.db("review");
// Creating respective routes
// ======================================== GET REQUEST from service only start
app.get("/services", async (req, res) => {
  const collection = db.collection("services");
  const query = {};
  const size = parseInt(req.query.size);
  if (size) {
    const cursor = collection.find(query);
    const service = await cursor.limit(size).toArray();
    if (service) {
      res.send({
        status: "success",
        data: service,
      });
    }else{
        res.send({
            status: "error",
            data: []
        })
    }
  } else {
    const cursor = collection.find(query);
    const service = await cursor.toArray();
    if(service){
        res.send({
            status: "success",
            data: service,
          });
    }else{
        res.send({
            status: "error",
            data: []
        })
    }
  }
});
// ======================================== GET REQUEST from service only end
    // ======================================== POST REQUEST start
    app.post("/services/create", async (req, res) => {
        const collection = db.collection("services");
        const query = req.body;
        const user = await collection.insertOne(query);
        res.send({
          status: "success",
          data: user,
        });
      });
      // ======================================== POST REQUEST end
    // ======================================== POST review start
    app.post("/review/create", async (req, res) => {
        const collection = db.collection("userReview");
        const query = req.body;
        const user = await collection.insertOne(query);
        res.send({
          status: "success",
          data: user,
        });
      });
      // ======================================== POST review end
      // get request with params, for specific data start
      app.get("/services/:id", async (req, res) => {
        const collection = db.collection("services");
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const item = await collection.findOne(query);
        if (item) {
          res.send({
            status: "success",
            data: item,
          });
        } else {
          res.send({
            status: "error",
            data: [],
          });
        }
      });
      // get request with params, for specific data end
      // get information for review input start (privet)
      app.get("/addReview/:id", async (req, res) => {
        const collection = db.collection("services");
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const item = await collection.findOne(query);
        if (item) {
          res.send({
            status: "success",
            data: item,
          });
        } else {
          res.send({
            status: "error",
            data: [],
          });
        }
      });
      // get information for review input end (privet)
      // find review with id
      app.get("/getReview/:id", async (req, res) => {
  
        const collection = db.collection("userReview");
        const id = req.params.id;
        const query = {serviceId: id};
        const reviews = await collection.find(query).sort({time: -1}).toArray();
        if(reviews){
          res.send({
            status: "success",
            data: reviews
          })
        }else{
          res.send({
            status: "error",
            data: []
          })
        }
      })
      // find review with id

      // get information for review input start (privet)
      app.get("/getMyReview/:email", verifyJWT, async (req, res) => {
        const collection = db.collection("userReview");
        const email = req.params.email;
        const decoded = req.decoded;
        if(decoded.email !== req.params.email){
            return res.status(403).send({message: 'unauthorized access'})
        }
        const query = {userEmail : email};
        const reviews = await collection.find(query).sort({time: -1}).toArray();
        if (reviews) {
          res.send({
            status: "success",
            data: reviews,
          });
        } else {
          res.send({
            status: "error",
            data: [],
          });
        }
      });
      // delete service
      // get information for review input end (privet)
      app.delete("/deleteService/:id", async (req, res) => {
        const collection = db.collection("services");
        const id = req.params.id;
        console.log(id);
        const query = {_id : ObjectId(id)};
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.send({
            status: "Successfully deleted one document.",
            data: result
          })
          console.log("Successfully deleted one document.");
        } else {
          res.send({
            status: 'No data matched!',
            data: []
          })
        }
      });
      // get information for review input end (privet)
      app.delete("/delete/:id", async (req, res) => {
        const collection = db.collection("userReview");
        const id = req.params.id;
        console.log(id);
        const query = {_id : ObjectId(id)};
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.send({
            status: "Successfully deleted one document.",
            data: result
          })
          console.log("Successfully deleted one document.");
        } else {
          res.send({
            status: 'No data matched!',
            data: []
          })
        }
      });
      // delete review
      // update review start
      app.put('/reviewUpdate/:id', async(req, res) => {
        const collection = db.collection("userReview");
        const id = req.params.id;
        console.log(id)
        const filter = {_id: ObjectId(id)}
        const updatedReview = req.body;
        const option = {upsert: true};
        const updatedDoc = {
          $set: {
            reviewText : updatedReview.changes
          }
        }
        const result = await collection.updateOne(filter, updatedDoc, option)
        res.send(result)
        console.log(updatedReview);

      })
      // update review end 

// main section end

app.get("/", (req, res) => {
  res.send("Server connected");
});
app.listen(port, () => {
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Mongodb connected");
    }
  });
  console.log("Server connected", process.env.PORT);
});
