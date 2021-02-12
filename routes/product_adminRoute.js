const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { authUser, authRole } = require("../config/auth");
const user = require("../models/user");

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const layout = "./layouts/adminLayout";

router.get("/", authUser, authRole(1), async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const products = await Product.find(searchOptions);
    res.render("product/index", {
      user: req.user.username,
      layout: layout,
      products: products,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/new", authUser, authRole(1), async (req, res) => {
  try {
    res.render("product/new", {
      user: req.user.username,
      layout: layout,
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

  saveCover(product, req.body.cover);

  try {
    const newProduct = await product.save();
    res.redirect(`/admin/products/${product.id}`);
  } catch (error) {
    renderNewPage(req, res, product, true);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product/show", {
      user: req.user.username,
      layout: layout,
      product,
    });
  } catch (error) {
    res.redirect("/admin/products");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product/edit", {
      user: req.user.username,
      layout: layout,
      product: product,
    });
  } catch (error) {
    res.redirect(`admin/products/${product.id}`);
  }
});

router.put("/:id", async (req, res) => {
  let product;

  try {
    product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    if (req.body.cover != null && req.body.cover != "") {
      saveCover(product, req.body.cover);
    }
    await product.save();
    res.redirect(`/admin/products/${product.id}`);
  } catch (error) {
    if (err) throw err;
    if (product != null) {
      renderEditPage(req, res, product, true);
    } else {
      res.redirect(`/admin/products`);
    }
  }
});

router.delete("/:id", async (req, res) => {
  let product;

  try {
    product = await Product.findById(req.params.id);
    await product.remove();
    res.redirect("/admin/products");
  } catch (error) {
    if (product != null) {
      res.render("product/show", {
        user: req.body.username,
        layout: layout,
        product: product,
        errorProduct: "Error removing book!",
      });
    } else {
      res.redirect("/admin/products");
    }
  }
});

async function renderNewPage(req, res, product, hasError = false) {
  renderFormPage(req, res, product, "new", hasError);
}
async function renderEditPage(req, res, product, hasError = false) {
  renderFormPage(req, res, product, "edit", hasError);
}

async function renderFormPage(req, res, product, form, hasError = false) {
  try {
    const params = {
      user: req.user.username,
      layout: layout,
      product: product,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorProduct = "Error Updating Product";
      } else {
        params.errorProduct = "Error Creating Product";
      }
    }
    res.render(`product/${form}`, params);
  } catch (e) {
    console.log(e);
    res.redirect("/admin/products");
  }
}
function saveCover(product, coverEncoded) {
  if (coverEncoded == null) {
    return;
  }
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImageName = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
}
module.exports = router;
