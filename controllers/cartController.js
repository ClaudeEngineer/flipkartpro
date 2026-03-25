const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc  Get user cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price stock isActive");
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, cart });
});

// @desc  Add item to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, color, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) { res.status(404); throw new Error("Product not found"); }
  if (product.stock < qty) { res.status(400); throw new Error("Insufficient stock"); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const key = `${productId}-${size}-${color}`;
  const existIdx = cart.items.findIndex(i => `${i.product}-${i.size}-${i.color}` === key);

  if (existIdx > -1) {
    cart.items[existIdx].qty += qty;
  } else {
    cart.items.push({ product: productId, name: product.name, price: product.price, emoji: product.emoji, colorHex: product.colorHex, size, color, qty });
  }
  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Update cart item qty
// @route PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error("Cart item not found"); }

  if (qty <= 0) cart.items.pull(req.params.itemId);
  else item.qty = qty;

  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:itemId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Clear entire cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
