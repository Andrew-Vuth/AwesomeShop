const express = require("express");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createAt: "desc" });
    res.render("index", { products: products });
  } catch (error) {}
});

module.exports = router;
