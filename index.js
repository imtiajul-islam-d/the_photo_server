const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware start
app.use(cors());
app.use(express.json());
// custom middleware start
app.use("*", (req, res, next) => {
  console.log(req.url);
  next();
});
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
        console.log(id);
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
        const reviews = await collection.find(query).toArray();
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
      app.get("/getMyReview/:email", async (req, res) => {
        const collection = db.collection("userReview");
        const email = req.params.email;
        console.log(email);
        const query = {userEmail : email};
        const reviews = await collection.find(query).toArray();
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
      // 

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
