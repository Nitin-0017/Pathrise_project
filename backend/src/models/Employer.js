const mongoose = require("mongoose");

const Employer = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phone: { type: String },
  experience: { type: Number, default: 0 }, 
  companyName: { type: String, required: true },
  companyWebsite: { type: String },
  companyAddress: { type: String },
  industry: { type: String },
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
}, { timestamps: true });

module.exports = mongoose.model("Employer", Employer);
