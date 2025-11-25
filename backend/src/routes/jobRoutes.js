const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { getJobs, createJob, updateJob, deleteJob } = require("../controllers/jobController");

// Public
router.get("/", requireAuth, getJobs);

// Employer/Admin only
router.post("/", requireAuth, requireRole("Employer", "Admin"), createJob);
router.put("/:id", requireAuth, requireRole("Employer", "Admin"), updateJob);
// Employer can delete their own jobs, Admin can delete any job (optional)
router.delete("/:id", requireAuth, requireRole("Employer", "Admin"), deleteJob);


module.exports = router;
