const Job = require("../models/jobModel");

// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    let jobs;
    if (req.user.role === "Employer") {
      // Sirf logged-in employer ke jobs fetch karo
      jobs = await Job.find({ postedBy: req.user.id });
    } else {
      // Candidate/Admin sab jobs dekh sakte hain
      jobs = await Job.find();
    }

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// CREATE NEW JOB
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Employers can only update their own jobs
    if (req.user.role === "Employer" && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job" });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only Employer who posted it or Admin can delete
    if (req.user.role === "Employer" && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied: Not your job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

