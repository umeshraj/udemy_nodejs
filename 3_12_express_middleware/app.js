const express = require("express");

const app = express();

// Index route
app.get("/", (req, res) => {
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
