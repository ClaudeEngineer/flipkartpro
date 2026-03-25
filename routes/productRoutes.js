const express = require("express");
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/",        getProducts);
router.get("/:id",     getProduct);
router.post("/",       protect, admin, createProduct);
router.put("/:id",     protect, admin, updateProduct);
router.delete("/:id",  protect, admin, deleteProduct);
router.post("/:id/reviews", protect, addReview);

module.exports = router;
