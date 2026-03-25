const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:    { type: String, required: true },
  price:   { type: Number, required: true },
  emoji:   { type: String },
  colorHex: { type: String },
  size:    { type: String, required: true },
  color:   { type: String, required: true },
  qty:     { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, i) => sum + i.qty, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
