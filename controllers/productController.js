const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc  Get all products (with filters, search, pagination)
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    category, subCategory, search,
    minPrice, maxPrice, sort,
    page = 1, limit = 20, featured,
  } = req.query;

  // ✅ FIXED: Don't filter by isActive so old + new data always shows
  // If you want to hide deleted products, use: const query = { isActive: { $ne: false } };
  const query = { isActive: { $ne: false } };

  if (category)    query.category    = category;
  if (subCategory) query.subCategory = subCategory;
  if (featured === "true") query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) }),
    };
  }
  if (search) query.$text = { $search: search };

  const sortOptions = {
    newest:    { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc:{ price: -1 },
    rating:    { rating: -1 },
    popular:   { numReviews: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const total    = await Product.countDocuments(query);
  const products = await Product
    .find(query)
    .sort(sortBy)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({
    success: true,
    count:   products.length,
    total,
    pages:   Math.ceil(total / Number(limit)),
    page:    Number(page),
    products,
  });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json({ success: true, product });
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, isActive: true });
  res.status(201).json({ success: true, product });
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json({ success: true, product });
});

// @desc  Delete product (admin) - soft delete
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json({ success: true, message: "Product removed" });
});

// @desc  Add review
// @route POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) { res.status(400); throw new Error("Product already reviewed"); }

  product.reviews.push({
    user: req.user._id, name: req.user.name,
    rating: Number(rating), comment,
  });
  product.calcRating();
  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});

module.exports = {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview,
};
