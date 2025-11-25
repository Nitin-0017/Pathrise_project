const Application = require("../models/applicationModel");

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

  const apps = await Application.find({ applicant: userId })
    .populate("job applicant");

  res.json(apps);
};

