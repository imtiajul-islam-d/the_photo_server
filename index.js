const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
client.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    // Now database is connected do the rest things here
    const db = client.db("review");
    // Creating respective routes
    // ======================================== GET REQUEST from home only start
    app.get("/services", async (req, res) => {
      const collection = db.collection("services");
      const query = {};
      const size = parseInt(req.query.size);
      if (size) {
        const cursor = collection.find(query);
        const service = await cursor.limit(size).toArray();
        res.send({
          status: "success",
          data: service,
        });
      } else {
        const cursor = collection.find(query);
        const service = await cursor.toArray();
        res.send({
          status: "success",
          data: service,
        });
      }
    });
    // ======================================== GET REQUEST from home only end
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
  }
});
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
