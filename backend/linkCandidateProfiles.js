const User = require("./src/models/userModel");
const CandidateProfile = require("./src/models/candidateProfileModel");

async function linkProfiles() {
  try {
    const users = await User.find({ role: "Candidate", candidateProfile: null });
    for (const user of users) {
      const profile = await CandidateProfile.findOne({ user: user._id });
      if (profile) {
        user.candidateProfile = profile._id;
        await user.save();
      } else {
      }
    }
    console.log("All done linking candidate profiles!");
  } catch (err) {
    console.error("Error linking profiles:", err);
  }
}

module.exports = linkProfiles;
