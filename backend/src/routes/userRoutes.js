const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware"); // pick only the function

// GET /api/users/me - Get current user's profile
router.get("/me", requireAuth, getMe);

// PUT /api/users/me - Update current user's profile
router.put("/me", requireAuth, updateMe);

module.exports = router;
