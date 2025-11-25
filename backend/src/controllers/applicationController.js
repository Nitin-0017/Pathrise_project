// controllers/applicationController.js
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");

exports.applyToJob = async (req, res) => {
  const application = await Application.create({
    job: req.body.jobId,
    applicant: req.user.id
  });
  res.status(201).json({ message: "Application submitted", application });
};

exports.getApplications = async (req, res) => {
  const apps = await Application.find().populate("job applicant");
  res.json(apps);
};

exports.getApplicationsByUser = async (req, res) => {
  const userId = req.params.id;
  const apps = await Application.find({ applicant: userId }).populate("job applicant");
  res.json(apps);
};

// NEW: Employer can view applications only for their jobs
exports.getApplicationsByEmployer = async (req, res) => {
  try {
    // 1) Get jobs posted by this employer
    const jobs = await Job.find({ postedBy: req.user.id }).select("_id");
    const jobIds = jobs.map(job => job._id);

    // 2) Get applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title")
      .populate("applicant", "name email phone"); // candidate info

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
