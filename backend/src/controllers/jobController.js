const Job = require("../models/jobModel");

exports.getJobs = async (req, res) => {
  try {
    const search = req.query.search || "";
    const typeFilter = req.query.type || "";
    const locationFilter = req.query.location || "";
    const skillsFilter = req.query.skills || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    let filters = {};

    if (req.user.role === "Employer") {
      filters.postedBy = req.user.id;
    }

    if (search.trim() !== "") {
      const regex = new RegExp(search, "i");
      filters.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { skills: { $in: [regex] } }, 
      ];
    }

    if (typeFilter) {
      filters.type = typeFilter;
    }

    if (locationFilter.trim() !== "") {
      filters.location = { $regex: locationFilter, $options: "i" };
    }

    if (skillsFilter.trim() !== "") {
      const skillsArr = skillsFilter.split(",").map((s) => s.trim());
      filters.skills = { $all: skillsArr.map((s) => new RegExp(s, "i")) };
    }

    const totalJobs = await Job.countDocuments(filters);

    const jobs = await Job.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};


exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

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

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

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

