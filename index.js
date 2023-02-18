var express = require("express");
var cors = require("cors");
var mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const port = 8000;
var app = express();
let dburl =
  "";
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Started Succe");
}); //http://localhost:8000/

app.get("/data", (req, res) => {
  mongoClient.connect(dburl, (err, cluster) => {
    if (err) {
      console.log("Connection Failed to connect with Database");
      res.json({
        OK: false,
        data: "Connection Failed to connect with Database",
      });
    } else {
      let db = cluster.db("FSAR");
      var collectionInsightRef = db.collection("Insightcarddata");
      collectionInsightRef.find({}).toArray((err, insightData) => {
        if (err) {
          console.log("Error while Getting the data insight data");
          res.json({
            OK: false,
            data: "Error while Getting the data",
          });
        } else {
          res.json({
            OK: true,
            data: insightData,
          });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  //http://localhost:8000/login
  var username = req.body.username;
  var password = req.body.password;

  mongoClient.connect(dburl, (err, cluster) => {
    if (err) {
      console.log("Connection Failed to connect with Database");
      res.json({
        OK: false,
        data: "Connection Failed to connect with Database",
      });
    } else {
      let db = cluster.db("FSAR");
      let collectionRef = db.collection("users");
      collectionRef.find().toArray((err, info) => {
        if (err) {
          res.json({
            OK: false,
            data: "Something Went Wrong",
          });
        } else {
          var newData = info.filter((d) => {
            return d.username === username && d.password === password;
          });

          if (newData.length > 0) {
            res.json({
              Ok: true,
              data: newData,
              message: "Valid User",
            });
            // var collectionInsightRef = db.collection("Insightcarddata");
            // collectionInsightRef.find({}).toArray((err, insightData) => {
            //   if (err) {
            //     console.log("Error while Getting the data insight data");
            //     res.json({
            //       OK: false,
            //       data: "Error while Getting the data",
            //     });
            //   } else {
            //     res.json({
            //       OK: true,
            //       data: insightData,
            //     });
            //   }
            // });
          } else {
            res.json({
              Ok: false,
              data: "Please Check the Credentails",
            });
          }
        }
      });
    }
  });
});

app.post("/signup", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var city = req.body.city;
  var gender = req.body.gender;

  var newuser = {
    username,
    password,
    email,
    city,
    gender,
  };
  mongoClient.connect(dburl, (err, cluster) => {
    if (err) {
      res.json({
        OK: false,
        data: "Connection Failed to connect with Database",
      });
    } else {
      let db = cluster.db("FSAR");
      let collectionRef = db.collection("users");
      collectionRef.insertOne(newuser, (err, d) => {
        if (err) {
          res.json({
            OK: false,
            data: "Registration Failed",
          });
        } else {
          res.json({
            OK: true,
            data: "Registration Successfully",
          });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log("Server started");
});
