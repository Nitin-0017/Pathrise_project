import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import "./Jobs.css";

export default function Jobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

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
      setFilteredJobs(res.data); // default job list
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchQuery.toLowerCase();

    const results = jobs.filter((job) => {
      const title = job.title ? job.title.toLowerCase() : "";
      const company = job.company ? job.company.toLowerCase() : "";
      const location = job.location ? job.location.toLowerCase() : "";
      const skills = Array.isArray(job.skills)
        ? job.skills.join(" ").toLowerCase()
        : "";

      return (
        title.includes(q) ||
        company.includes(q) ||
        location.includes(q) ||
        skills.includes(q)
      );
    });

    setFilteredJobs(results);
    setCurrentPage(1); // reset page on search
  }, [searchQuery, jobs]);

  const applyJob = async (jobId) => {
    try {
      await API.post("/applications", { jobId });
      alert("Application submitted!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply");
    }
  };

  const handleNavigate = (page) => {
    if (page === "dashboard") navigate("/candidate");
    else navigate(`/candidate/${page}`);
  };

  // Pagination calculation
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {/* 🔍 Search Bar */}
        <div className="job-search-bar">
          <input
            type="text"
            placeholder="Search jobs by title, company, location, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No jobs match your search.</p>
        ) : (
          <>
            <div className="jobs-list">
              {currentJobs.map((job) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    className={`page-btn ${num === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
