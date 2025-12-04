const CandidateProfile = require("../models/candidateProfileModel");

exports.getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate("user", "-password");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = { ...req.body, user: req.user.id };

    if (req.file) {
      profileData.resume = `/uploads/resumes/${req.file.filename}`;
    }

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user.id },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
