const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     { type: String, required: true },
  emoji:    { type: String },
  price:    { type: Number, required: true },
  size:     { type: String, required: true },
  color:    { type: String, required: true },
  qty:      { type: Number, required: true, min: 1 },
  image:    { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, enum: ["cod","upi","card","netbanking"] },
    paymentResult: {
      id:     { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice:    { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    isPaid:        { type: Boolean, default: false },
    paidAt:        { type: Date },
    orderStatus:   { type: String, enum: ["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled"], default: "Confirmed" },
    deliveredAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
