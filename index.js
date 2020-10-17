const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('servicelist'));
app.use(fileUpload());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.giumd.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  // client
  const OrderListItems = client.db("CreativeAgency").collection("OrderList");
  app.post('/add',(req, res) =>{
      const booking = req.body;
      OrderListItems.insertOne(booking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.get('/adding',(req, res) =>{
    OrderListItems.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  app.get("/add", (req, res) => {
    OrderListItems.find({})
        .toArray((err, document) => {
            res.send(document);
        })
})

  // Review
  const reviewListItems = client.db("CreativeAgency").collection("Review");
  app.post("/allReview", (req, res) => {
    const newReview = req.body;
    reviewListItems.insertMany(newReview)
        .then(result => {
          res.send(result.insertedCount > 0);
        })
  })
  app.get("/reviews", (req, res) => {
  reviewListItems.find({}).limit(6)
        .toArray((err, document) => {
            res.send(document);
        })
  })
  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    reviewListItems.insertOne(newReview)
        .then(result => {
          res.send(result.insertedCount > 0);
        })
  })
  // adminPanel
  const adminListItems = client.db("CreativeAgency").collection("admin");
  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    adminListItems.insertOne(newAdmin)
        .then(result => {
          res.send(result.insertedCount > 0);
        })
  })
  app.get('/isAdmin', (req, res) => {
        adminListItems.find({})
            .toArray((err, admin) => {
                res.send(admin);
            })
    })
//   app.post('/isAdmin', (req, res) => {
//     const email = req.body.email;
//     adminListItems.find({ email: email })
//         .toArray((err, admin) => {
//             res.send(admin.length > 0);
//         })
// })

    // service
    const serviceListItems = client.db("CreativeAgency").collection("Service"); 
    app.post('/addAService',(req, res)=>{
      const name = req.body.name;
      const description = req.body.description;
      const file = req.files.file;
      const  newImg = file.data;
      const encImg = newImg.toString('base64');
        var image ={
          contentType:file.mimetype,
          size:file.size,
          img:Buffer.from(encImg, 'base64')
        }
        serviceListItems.insertOne({name,description,image})
      .then(result=>{
          res.send(result.insertedCount>0);
        })
    })
    app.get("/services", (req, res) => {
      serviceListItems.find({})
          .toArray((err, document) => {
              res.send(document);
          })
  })
});



app.get('/', (req, res) =>{
    res.send("hello from db it's working working")
})
app.listen(process.env.PORT || port)