const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const User = require("../models/userModel");

// ---------------------- Employer Dashboard ----------------------
exports.getDashboardData = async (req, res) => {
  try {
    const employerId = req.user.id;

    const totalJobs = await Job.countDocuments({ postedBy: employerId });
    const employerJobs = await Job.find({ postedBy: employerId }).select("_id");
    const employerJobIds = employerJobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: employerJobIds },
    });
    const activeCandidatesList = await Application.distinct("applicant", {
      job: { $in: employerJobIds },
    });
    const activeCandidates = activeCandidatesList.length;

    const applicationsOverTime = await Application.aggregate([
      { $match: { job: { $in: employerJobIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          applications: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const applicationsPerJob = await Application.aggregate([
      { $match: { job: { $in: employerJobIds } } },
      { $group: { _id: "$job", applications: { $sum: 1 } } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobData",
        },
      },
      { $unwind: "$jobData" },
      { $project: { job: "$jobData.title", applications: 1 } },
    ]);

    res.json({
      stats: { totalJobs, totalApplications, activeCandidates },
      applicationsOverTime: applicationsOverTime.map((a) => ({
        date: a._id,
        applications: a.applications,
      })),
      applicationsPerJob: applicationsPerJob.map((a) => ({
        job: a.job,
        applications: a.applications,
      })),
    });
  } catch (error) {
    console.error("Employer Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// ---------------------- Candidate Dashboard ----------------------
exports.getCandidateDashboardData = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const candidate = await User.findById(candidateId);

    const totalApplications = await Application.countDocuments({
      applicant: candidateId,
    });
    const jobsAppliedList = await Application.distinct("job", {
      applicant: candidateId,
    });
    const jobsApplied = jobsAppliedList.length;
    const interviewsScheduled = candidate?.interviewsScheduled || 0;

    const applicationsOverTimeAgg = await Application.aggregate([
      { $match: { applicant: candidateId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          applications: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const applicationsOverTime = applicationsOverTimeAgg.map((a) => ({
      date: a._id, // already properly formatted
      applications: Number(a.applications) || 0,
    }));

    const applicationsStatusAgg = await Application.aggregate([
      { $match: { applicant: candidateId } },
      {
        $group: {
          _id: { $ifNull: ["$status", "Pending"] },
          count: { $sum: 1 },
        },
      },
    ]);
    const applicationsStatus = applicationsStatusAgg.map((a) => ({
      status: a._id,
      count: Number(a.count) || 0,
    }));

    res.json({
      stats: { totalApplications, jobsApplied, interviewsScheduled },
      applicationsOverTime,
      applicationsStatus,
    });
  } catch (error) {
    console.error("Candidate Dashboard Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch candidate dashboard data" });
  }
};
