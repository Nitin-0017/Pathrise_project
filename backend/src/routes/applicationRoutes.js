const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { 
  applyToJob, 
  getApplications,
  getApplicationsByUser,
  getApplicationsByEmployer,
  deleteApplication,
  updateApplicationStatus
} = require("../controllers/applicationController");

router.post("/", requireAuth, requireRole("Candidate"), applyToJob);

router.get("/user/:id", requireAuth, requireRole("Candidate"), getApplicationsByUser);

router.get("/", requireAuth, requireRole("Employer", "Admin"), getApplications);

router.get("/employer", requireAuth, requireRole("Employer"), getApplicationsByEmployer);

router.delete("/:id", requireAuth, requireRole("Employer"), deleteApplication);

router.patch("/:id/status", requireAuth, requireRole("Employer"), updateApplicationStatus);

module.exports = router;
