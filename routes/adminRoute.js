const express = require("express");
const router = express.Router();
const { authUser, authRole } = require("../config/auth");

const Product = require("../models/product");

router.get("/", authUser, authRole(1), async (req, res) => {
  const products = await Product.find({}).sort({ date: 1 }).limit(4).exec();
  try {
    res.render("adminIndex", {
      layout: "./layouts/adminLayout",
      user: req.user.username,
      products: products,
    });
  } catch (error) {
    res.redirect("/user/login");
  }
});

module.exports = router;
