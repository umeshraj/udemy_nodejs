const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// User login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// User register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// register form POST
router.post("/register", (req, res) => {
  // console.log(req.body);
  // res.send("Register");
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match!" });
  }

  if (req.body.password.length < 2) {
    errors.push({ text: "Passwords should be atleast 2 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    res.send("passed");
  }
});

module.exports = router;
