const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: [true, "Product name required"], trim: true },
    description:   { type: String, required: [true, "Description required"] },
    price:         { type: Number, required: [true, "Price required"], min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    category:      { type: String, required: true, enum: ["Men", "Women", "Kids"] },
    subCategory:   {
      type: String, required: true,
      // ✅ Added Sneakers to enum
      enum: ["Shirts","Jeans","Shoes","Sneakers","Jackets","Dresses","T-Shirts","Shorts","Sandals","Hoodies","Accessories"],
    },
    images:        [{ type: String }],
    emoji:         { type: String,    default: "👕" },
    colorHex:      { type: String,    default: "#0D1B3E" },
    sizes:         [{ type: String }],
    colors:        [{ type: String }],
    stock:         { type: Number,    default: 100, min: 0 },
    badge:         { type: String,    enum: ["Bestseller","New","Hot","Sale","Trending",null], default: null },
    reviews:       [reviewSchema],
    rating:        { type: Number,    default: 0 },
    numReviews:    { type: Number,    default: 0 },
    isFeatured:    { type: Boolean,   default: false },
    // ✅ isActive default true — but seeder must set it explicitly too
    isActive:      { type: Boolean,   default: true },
    tags:          [{ type: String }],
  },
  { timestamps: true }
);

productSchema.methods.calcRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating     = parseFloat((total / this.reviews.length).toFixed(1));
  this.numReviews = this.reviews.length;
};

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
