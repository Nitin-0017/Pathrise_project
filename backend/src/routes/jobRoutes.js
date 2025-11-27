const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { getJobs, createJob, updateJob, deleteJob } = require("../controllers/jobController");

router.get("/", requireAuth, getJobs);

router.post("/", requireAuth, requireRole("Employer"), createJob);
router.put("/:id", requireAuth, requireRole("Employer"), updateJob);
router.delete("/:id", requireAuth, requireRole("Employer"), deleteJob);

module.exports = router;
