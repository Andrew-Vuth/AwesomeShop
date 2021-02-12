const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/user");

router.get("/signin", (req, res) => {
  try {
    res.render("signIn", { layout: "./layouts/authLayout" });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/login", (req, res) => {
  try {
    res.render("logIn", { layout: "./layouts/authLayout" });
  } catch (error) {
    res.redirect("/");
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;
    let errors = [];

    if (!username || !email || !password || !confirm_password) {
      errors.push({ msg: "Please enter all fields" });
    }

    if (password != confirm_password) {
      errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 8) {
      errors.push({ msg: "Password must be at least 8 characters" });
    }

    if (errors.length > 0) {
      console.log(errors);
      res.render("signIn", {
        layout: "./layouts/authLayout",
        errors,
        username,
        email,
        password,
        confirm_password,
      });
      console.log(req.body);
    } else {
      // Validation passed
      const findUser = await User.findOne({ email: email });
      if (findUser) {
        // User exists
        errors.push({ msg: "Email is already taken" });
        res.render("signIn", {
          layout: "./layouts/authLayout",
          errors,
          username,
          email,
          password,
          confirm_password,
        });
      } else {
        // Initiallize user model with the inputted attribute
        const user = new User({
          username,
          email,
          password,
        });

        //Hash password
        const hashedPassowrd = await bcrypt.hash(user.password, 10);
        user.password = hashedPassowrd;
        // Save user to DB
        const newUser = await user.save();
        req.flash("success_msg", "You are now registered!");
        // console.log(user);
        res.redirect("/user/login");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user)
      return res.render("logIn", {
        layout: "./layouts/authLayout",
        error: info.message,
      });

    req.logIn(user, (err) => {
      if (err) throw err;
      if (user.role == 0) {
        res.redirect("/");
      } else if (user.role == 1) {
        res.redirect("/admin");
      }
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/user/login");
});

module.exports = router;
