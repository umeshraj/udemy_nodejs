const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// load models
require("./models/User");
require("./models/Story");

// passport config
require("./config/passport")(passport);

// Load routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

// Load keys
const keys = require("./config/keys");

// Handlebars Helpers
const { truncate, stripTags, formatDate, select } = require("./helpers/hbs");

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose
  .connect(keys.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride("_method"));

// index
// app.get("/", (req, res) => {
//   res.send("It works!");
// });

// handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

// heroku
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
