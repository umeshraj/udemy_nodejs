const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
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
const Idea = mongoose.model("ideas");

// Handlebars middlware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// middleware for express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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

// Idea index page
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      console.log(ideas);
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Add idea form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// Edit idea form
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

// Process form
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    console.log("Saving to db");
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Video idea added");
      res.redirect("/ideas");
    });

    // res.send("passed");
  }
  // console.log(req.body);
  // res.send("ok");
});

// Edit form process
app.put("/ideas/:id", (req, res) => {
  // res.send("PUT");
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash("success_msg", "Video idea updated");
      res.redirect("/ideas");
    });
  });
});

// Delete idea
app.delete("/ideas/:id", (req, res) => {
  // res.send("DELETE");
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Video idea removed");
    res.redirect("/ideas");
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
