const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getDashboardData,
  getCandidateDashboardData
} = require("../controllers/dashboardController");

/* Employer dashboard data (keep old /dashboard route) */
router.get("/dashboard", requireAuth, requireRole("Employer"), getDashboardData);

/* Candidate dashboard data */
router.get("/candidate", requireAuth, requireRole("Candidate"), getCandidateDashboardData);

module.exports = router;
