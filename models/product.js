const mongoose = require("mongoose");
const path = require("path");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImageName: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImageName.toString("base64")}`;
  }
});

module.exports = mongoose.model("Product", productSchema);
