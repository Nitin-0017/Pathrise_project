// src/pages/Employer/Jobs.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // axios instance
import Sidebar from "../../components/Sidebar";
import "./Jobs.css";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    skills: "",
    description: ""
  });
  const [editingJobId, setEditingJobId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")); // Employer info

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get(`/jobs?postedBy=${user.id}`);
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: form.skills.split(",").map(s => s.trim()) };

      if (editingJobId) {
        // Update job
        await API.put(`/jobs/${editingJobId}`, payload);
        alert("Job updated successfully!");
      } else {
        // Add new job
        await API.post("/jobs", payload);
        alert("Job added successfully!");
      }

      setForm({ title: "", company: "", location: "", type: "", skills: "", description: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save job");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    const token = localStorage.getItem("token"); // make sure you store token on login
    await API.delete(`/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Job deleted!");
    fetchJobs();
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to delete job");
  }
};



  const handleEditClick = (job) => {
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      skills: job.skills.join(", "),
      description: job.description
    });
    setEditingJobId(job._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        activePage="jobs" 
        onLogout={() => { 
          localStorage.removeItem("user"); 
          window.location.href = "/login"; 
        }} 
      />

      {/* Main Content */}
      <main className="main">
        <h2>{editingJobId ? "Edit Job" : "Add New Job"}</h2>

        {/* Centered Add/Edit Job Form */}
        <div className="job-form-container">
          <form className="job-form" onSubmit={handleAddOrUpdateJob}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" required />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
            <input name="type" value={form.type} onChange={handleChange} placeholder="Full-time / Part-time" required />
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" />
            <button type="submit">{editingJobId ? "Update Job" : "Add Job"}</button>
          </form>
        </div>

        {/* Jobs Table */}
        {jobs.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px" }}>No jobs posted yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.skills?.join(", ")}</td>
                  <td>
                    <button onClick={() => handleEditClick(job)}>Edit</button>
                    <button onClick={() => handleDelete(job._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
