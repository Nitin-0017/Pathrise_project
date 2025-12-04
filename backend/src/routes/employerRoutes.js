const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getProfile, createOrUpdateProfile } = require("../controllers/employerController");
const upload = require("../middleware/upload"); // for resume

const router = express.Router();

router.get("/profile", requireAuth, getProfile);
router.post("/profile", requireAuth, upload.single("resume"), createOrUpdateProfile);

module.exports = router;
