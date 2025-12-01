const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { getCandidateActivityFeed } = require("../controllers/applicationController");

// Protected candidate route
router.get("/candidate/activity", requireAuth, requireRole("Candidate"), getCandidateActivityFeed);

module.exports = router;
