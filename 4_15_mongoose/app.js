const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

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

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
