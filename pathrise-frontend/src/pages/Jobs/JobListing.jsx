import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./JobListing.css"

export default function JobListing() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
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
    fetchApplications();
  }, []);

  // Fetch all jobs
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

  // Fetch candidate's applications
  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications"); // candidate only
      const userApps = res.data.filter(app => app.applicant._id === JSON.parse(localStorage.getItem("user")).id);
      setApplications(userApps);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply to a job
  const applyJob = async (jobId) => {
    try {
      await API.post("/applications", { jobId });
      alert("Application submitted!");
      fetchApplications(); // update table
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

      <main className="main">
        <h1>Available Jobs</h1>
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><b>Company:</b> {job.company}</p>
                <p><b>Location:</b> {job.location}</p>
                <p><b>Type:</b> {job.type}</p>
                <p>{job.description}</p>
                <button
                  disabled={applications.some(app => app.job._id === job._id)}
                  onClick={() => applyJob(job._id)}
                >
                  {applications.some(app => app.job._id === job._id) ? "Applied" : "Apply"}
                </button>
              </div>
            ))}
          </div>
        )}

        <h2>Your Applications</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.job.title}</td>
                <td>{app.job.company}</td>
                <td className={app.status.toLowerCase()}>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
