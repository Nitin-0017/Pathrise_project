const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  createOrUpdateProfile,
  getProfile
} = require("../controllers/candidateProfileController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/profile", requireAuth, getProfile);
router.post("/profile", requireAuth, upload.single("resume"), createOrUpdateProfile);

module.exports = router;
