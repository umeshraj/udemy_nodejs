const express = require("express");

const app = express();

// How middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  req.name = "Umesh Rajashekar";
  next();
});

// Index route
app.get("/", (req, res) => {
  console.log(req.name);
  res.send("INDEX");
});

// About page
app.get("/about", (req, res) => {
  res.send("ABOUT2");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
