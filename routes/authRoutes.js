const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, toggleWishlist } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register",    register);
router.post("/login",       login);
router.get("/profile",      protect, getProfile);
router.put("/profile",      protect, updateProfile);
router.put("/wishlist/:productId", protect, toggleWishlist);

module.exports = router;
