// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { 
  applyToJob, 
  getApplications,
  getApplicationsByUser,
  getApplicationsByEmployer
} = require("../controllers/applicationController");

/* Candidate applies to a job */
router.post("/", requireAuth, requireRole("Candidate"), applyToJob);

/* Candidate views their own applications */
router.get("/user/:id", requireAuth, requireRole("Candidate"), getApplicationsByUser);

/* Employer/Admin can view all applications */
router.get("/", requireAuth, requireRole("Employer", "Admin"), getApplications);

/* NEW: Employer views applications only for their jobs */
router.get("/employer", requireAuth, requireRole("Employer"), getApplicationsByEmployer);

module.exports = router;
