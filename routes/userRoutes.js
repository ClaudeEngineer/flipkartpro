const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

// GET /api/users  - admin: list all users
router.get("/", protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ success: true, users });
}));

// GET /api/users/:id - admin: get user
router.get("/:id", protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ success: true, user });
}));

// PUT /api/users/:id - admin: update role/status
router.put("/:id", protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role, isActive: req.body.isActive }, { new: true }).select("-password");
  res.json({ success: true, user });
}));

// DELETE /api/users/:id - admin: deactivate user
router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: "User deactivated" });
}));

module.exports = router;
