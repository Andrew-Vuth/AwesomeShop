const LocalStratey = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStratey(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });

        try {
          if (!user) {
            return done(null, false, {
              message: "This Email is not registered",
            });
          }

          bcrypt.compare(password, user.password, (err, isMatched) => {
            if (err) throw err;
            if (isMatched) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect!" });
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
