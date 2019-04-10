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
  console.log(req.body);
  res.send("Register");
});

module.exports = router;
