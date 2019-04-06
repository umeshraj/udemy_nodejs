const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

// map global promise - get rid of deprication warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", { useMongoClient: true })
  .then(() => console.log("Mongodb connected.."))
  .catch(err => console.log(err));

// Load the idea model
require("./models/Idea");
const idea = mongoose.model("ideas");

// Handlebars middlware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// How middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  // req.name = "Umesh Rajashekar";
  next();
});

// Index route
app.get("/", (req, res) => {
  // console.log(req.name);
  const title = "Welcome1";
  res.render("index", {
    title: title
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// Add idea form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
