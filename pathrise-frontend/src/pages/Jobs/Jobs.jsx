// src/pages/Jobs/Jobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import "./Jobs.css";

export default function Jobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await API.post("/applications", { jobId });
      alert("Application submitted!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply");
    }
  };

  // ⭐ Updated navigation (same as Applications.jsx)
  const handleNavigate = (page) => {
    if (page === "dashboard") navigate("/candidate");
    else navigate(`/candidate/${page}`);
  };

  if (!user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar
        user={user}
        activePage="jobs"
        onNavigate={handleNavigate}
        onLogout={() => {
          localStorage.clear();
          navigate("/login");
        }}
      />

      <main className="main">
        <h2>Available Jobs</h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No Available Jobs</p>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.type}</p>
                <p><strong>Skills:</strong> {job.skills?.join(", ") || "N/A"}</p>

                <button
                  className="btn-apply"
                  onClick={() => applyJob(job._id)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
