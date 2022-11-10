// imports
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// define port and app
const port = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// default api
app.get("/", (req, res) => {
  res.send("Server running successfully!!");
});

// mongodb server connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afwac63.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// setting up the apis

async function run() {
  const serviceCollection = client.db("serviceReview").collection("services");

  try {
    // get all services from db
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send({
        status: true,
        data: result,
      });
    });

    // get only top 3 services
    app.get("/topServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find();
      const result = await cursor.limit(3).toArray();
      res.send({
        status: true,
        data: result,
      });
    });

    // get the data of a specific service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send({
        status: true,
        data: result,
      });
    });

    // add a service
    app.post("/addService", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send({
        status: true,
        message: "Service added successfully!",
      });
    });
  } finally {
  }
}

run().catch((error) => console.error(error));

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
