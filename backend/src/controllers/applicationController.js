const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

exports.applyToJob = async (req, res) => {
  const application = await Application.create({
    job: req.body.jobId,
    applicant: req.user.id,
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

exports.getApplicationsByEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).select("_id");
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title postedBy")
      .populate("applicant", "name email phone");

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this application" });
    }
    await Application.findByIdAndDelete(applicationId);
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete application" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Accepted", "Rejected", "Interview Scheduled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    if (status === "Accepted") {
      const candidate = await User.findById(application.applicant);
      if (candidate) {
        candidate.interviewsScheduled = (candidate.interviewsScheduled || 0) + 1;
        await candidate.save();
      }
    }

    res.json({ message: `Application status updated to ${status}`, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update application status" });
  }
};
