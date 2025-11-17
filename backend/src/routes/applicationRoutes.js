const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { applyToJob, getApplications } = require("../controllers/applicationController");

// Candidates apply
router.post("/", requireAuth, requireRole("Candidate"), applyToJob);

// Employers/Admin view
router.get("/", requireAuth, requireRole("Employer", "Admin"), getApplications);

module.exports = router;
