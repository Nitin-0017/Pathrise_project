const User = require("../models/userModel");
const Employer = require("../models/Employer");

// Get employer profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Employer.findOne({ user: req.user.id });

    res.json({
      user, 
      age: profile?.age || "",
      gender: profile?.gender || "",
      experience: profile?.experience || "",
      companyName: profile?.companyName || "",
      companyWebsite: profile?.companyWebsite || "",
      companyAddress: profile?.companyAddress || "",
      industry: profile?.industry || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = { ...req.body, user: req.user.id };

    const profile = await Employer.findOneAndUpdate(
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
