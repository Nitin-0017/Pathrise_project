const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getDashboardData,
  getCandidateDashboardData
} = require("../controllers/dashboardController");

router.get("/dashboard", requireAuth, requireRole("Employer"), getDashboardData);

router.get("/candidate", requireAuth, requireRole("Candidate"), getCandidateDashboardData);

module.exports = router;
