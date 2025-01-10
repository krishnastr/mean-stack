const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();

mongoose.connect("mongodb+srv://krishnastr10:IH7ozbLsrE95GDIH@cluster0.sw1ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(resp =>  console.log('Database is connected successfully!'))
.catch(err => console.log('Database connectivity got failed'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then( documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  })
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id, req)
  Post.deleteOne({'_id': req.params.id}).then( documents => {
    res.status(200).json({
      message: "Posts deleted successfully!"
    });
  })
});

module.exports = app;
