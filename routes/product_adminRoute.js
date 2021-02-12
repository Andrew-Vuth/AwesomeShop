const express = require("express");
const router = express.Router();
const Product = require("../models/product");

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const products = await Product.find(searchOptions);
    res.render("product/index", {
      user: req.user.username,
      layout: "./layouts/adminLayout",
      products: products,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  try {
    res.render("product/new", {
      user: req.user.username,
      layout: "./layouts/adminLayout",
      product: new Product(),
    });
  } catch (error) {
    res.redirect("/admin/products");
  }
});
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  if (req.body.cover == null) {
    console.log("hi");
    return;
  }
  const cover = JSON.parse(req.body.cover);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImageName = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }

  try {
    const newProduct = await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    renderNewPage(req, res, product, true);
  }
});

router.get("/:id", (req, res) => {
  res.send("Show product for" + req.params.id);
});
router.get("/:id/edit", (req, res) => {
  res.send("Edit product for" + req.params.id);
});
router.put("/:id", (req, res) => {
  res.send("Update product for" + req.params.id);
});
router.delete("/:id", (req, res) => {
  res.send("Delete product for" + req.params.id);
});

async function renderNewPage(req, res, product, hasError = false) {
  try {
    const params = {
      user: req.user.username,
      layout: "./layouts/adminLayout",
      product: product,
    };
    if (hasError) params.errorCreate = "Error Creating Product";
    res.render("product/new", params);
  } catch (e) {
    console.log(e);
    res.redirect("/admin/products");
  }
}

module.exports = router;
