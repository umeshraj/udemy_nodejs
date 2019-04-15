const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// load user model
require("./models/User");

// passport config
require("./config/passport")(passport);

// Load routes
const auth = require("./routes/auth");

// Load keys
const keys = require("./config/keys");

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

// index
app.get("/", (req, res) => {
  res.send("It works!");
});

// Use routes
app.use("/auth", auth);

// heroku
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
