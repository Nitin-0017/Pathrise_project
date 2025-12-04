const mongoose = require("mongoose");

const Employer = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  // Personal Details
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phone: { type: String },
  experience: { type: Number, default: 0 }, // in years

  // Company Details
  companyName: { type: String, required: true },
  companyWebsite: { type: String },
  companyAddress: { type: String },
  industry: { type: String },

  // Jobs posted by employer
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
}, { timestamps: true });

module.exports = mongoose.model("Employer", Employer);
