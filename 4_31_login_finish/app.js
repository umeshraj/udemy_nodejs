const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// passport config
require("./config/passport")(passport);

// map global promise - get rid of deprication warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", { useMongoClient: true })
  .then(() => console.log("Mongodb connected.."))
  .catch(err => console.log(err));

// Handlebars middlware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// static folder
app.use(express.static(path.join(__dirname, "public")));
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

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
