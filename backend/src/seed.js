// src/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/userModel");
const Job = require("./models/jobModel");
const Application = require("./models/applicationModel");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ----- USERS -----

const users = await User.insertMany([
  // Employers
  { name: "Alice Johnson", email: "alice.johnson@techcorp.com", password: hashedPassword, role: "Employer" },
  { name: "Bob Smith", email: "bob.smith@innovatex.com", password: hashedPassword, role: "Employer" },
  { name: "Charlie Brown", email: "charlie.brown@globalsoft.com", password: hashedPassword, role: "Employer" },
  { name: "Diana Prince", email: "diana.prince@nextgensolutions.com", password: hashedPassword, role: "Employer" },

  // Candidates
  { name: "Ethan Hunt", email: "ethan.hunt@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Fiona Gallagher", email: "fiona.gallagher@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "George Miller", email: "george.miller@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Hannah Davis", email: "hannah.davis@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Ian Wright", email: "ian.wright@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Jessica Lee", email: "jessica.lee@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Kevin Adams", email: "kevin.adams@gmail.com", password: hashedPassword, role: "Candidate" },
  { name: "Laura White", email: "laura.white@gmail.com", password: hashedPassword, role: "Candidate" },
]);


    // Destructure for easy reference
    const [employer1, employer2, employer3, employer4, candidate1, candidate2, candidate3, candidate4, candidate5, candidate6, candidate7, candidate8] = users;

    // ----- JOBS (8 per employer) -----
    const jobTemplates = [
      { title: "Frontend Developer", description: "Build amazing UI components.", type: "Full-time", location: "Remote", salary: 80000, skills: ["React", "CSS", "JavaScript"] },
      { title: "Backend Developer", description: "Handle server-side logic and databases.", type: "Full-time", location: "Remote", salary: 90000, skills: ["Node.js", "Express", "MongoDB"] },
      { title: "Fullstack Engineer", description: "Work on both frontend and backend.", type: "Full-time", location: "New York", salary: 95000, skills: ["React", "Node.js", "MongoDB"] },
      { title: "DevOps Engineer", description: "Maintain infrastructure and CI/CD pipelines.", type: "Full-time", location: "San Francisco", salary: 100000, skills: ["AWS", "Docker", "Kubernetes"] },
      { title: "Data Analyst", description: "Analyze and visualize data.", type: "Full-time", location: "Remote", salary: 75000, skills: ["SQL", "Python", "Tableau"] },
      { title: "QA Engineer", description: "Ensure product quality.", type: "Contract", location: "Remote", salary: 70000, skills: ["Selenium", "Jest", "Cypress"] },
      { title: "Product Manager", description: "Oversee product development cycles.", type: "Full-time", location: "Boston", salary: 110000, skills: ["Agile", "JIRA", "Leadership"] },
      { title: "UX Designer", description: "Design intuitive user interfaces.", type: "Full-time", location: "Remote", salary: 85000, skills: ["Figma", "Sketch", "Adobe XD"] },
    ];

    const allJobs = [];

    for (const emp of [employer1, employer2, employer3, employer4]) {
      for (const jobTemplate of jobTemplates) {
        const job = await Job.create({ ...jobTemplate, postedBy: emp._id });
        allJobs.push({ job, employer: emp._id });
      }
    }

    // ----- APPLICATIONS (15 per employer) -----
    for (const emp of [employer1, employer2, employer3, employer4]) {
      const empJobs = allJobs.filter(j => j.employer.toString() === emp._id.toString()).map(j => j.job);

      const applicationsToCreate = [
        { job: empJobs[0], applicant: candidate1 },
        { job: empJobs[1], applicant: candidate2 },
        { job: empJobs[2], applicant: candidate3 },
        { job: empJobs[3], applicant: candidate4 },
        { job: empJobs[4], applicant: candidate5 },
        { job: empJobs[5], applicant: candidate6 },
        { job: empJobs[6], applicant: candidate7 },
        { job: empJobs[7], applicant: candidate8 },
        { job: empJobs[0], applicant: candidate2 },
        { job: empJobs[1], applicant: candidate3 },
        { job: empJobs[2], applicant: candidate4 },
        { job: empJobs[3], applicant: candidate5 },
        { job: empJobs[4], applicant: candidate6 },
        { job: empJobs[5], applicant: candidate7 },
        { job: empJobs[6], applicant: candidate8 },
      ];

      for (const app of applicationsToCreate) {
        await Application.create({ job: app.job._id, applicant: app.applicant._id });
      }
    }

    console.log("✅ Database seeded successfully with employers, candidates, jobs, and applications!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();
