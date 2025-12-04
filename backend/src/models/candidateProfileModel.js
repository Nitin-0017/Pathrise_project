const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  resume: {
    type: String, // Resume file URL (Cloud / Upload)
    default: null,
  },
  education: {
    type: [String], // Future expansion
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);
