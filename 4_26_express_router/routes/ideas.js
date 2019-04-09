const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load the idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Idea index page
router.get("/", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      // console.log(ideas);
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Add idea form
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

// Edit idea form
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

// Process form
router.post("/", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }
  if (errors.length > 0) {
    res.render("/add", {
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
      res.redirect("/");
    });

    // res.send("passed");
  }
  // console.log(req.body);
  // res.send("ok");
});

// Edit form process
router.put("/:id", (req, res) => {
  // res.send("PUT");
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash("success_msg", "Video idea updated");
      res.redirect("/");
    });
  });
});

// Delete idea
router.delete("/:id", (req, res) => {
  // res.send("DELETE");
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Video idea removed");
    res.redirect("/");
  });
});

module.exports = router;
