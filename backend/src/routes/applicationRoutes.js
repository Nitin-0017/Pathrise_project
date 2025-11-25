const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { 
  applyToJob, 
  getApplications,
  getApplicationsByUser 
} = require("../controllers/applicationController");

/* ----------------------------------------
   1) Candidate applies to a job
----------------------------------------- */
router.post(
  "/", 
  requireAuth, 
  requireRole("Candidate"), 
  applyToJob
);

/* ----------------------------------------
   2) Candidate can view ONLY THEIR applications
   URL → /api/applications/user/:id
----------------------------------------- */
router.get(
  "/user/:id", 
  requireAuth, 
  requireRole("Candidate"), 
  getApplicationsByUser
);

/* ----------------------------------------
   3) Employer/Admin can view ALL applications
   URL → /api/applications
----------------------------------------- */
router.get(
  "/", 
  requireAuth, 
  requireRole("Employer", "Admin"), 
  getApplications
);

module.exports = router;
