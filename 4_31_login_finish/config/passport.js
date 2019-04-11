const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = mongoose.model("users");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // console.log(email);
      // Match user
      User.findOne({
        email: email
      })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "No User Found" });
          }

          // console.log(password);
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            console.log(password);
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch(err => {
          console.log("Error!!!!!");
        });
    })
  );
};
