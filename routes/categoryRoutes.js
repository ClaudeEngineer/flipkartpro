const express = require("express");
const router = express.Router();

// Static category data (extend with a DB model if needed)
router.get("/", (req, res) => {
  res.json({
    success: true,
    categories: ["Men", "Women", "Kids"],
    subCategories: ["Shirts","Jeans","Shoes","Jackets","Dresses","T-Shirts","Shorts","Sneakers","Sandals","Hoodies","Accessories"],
  });
});

module.exports = router;
