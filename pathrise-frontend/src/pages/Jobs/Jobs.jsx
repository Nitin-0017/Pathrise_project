import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import "./Jobs.css";

export default function Jobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const perPage = 9;
  const debounceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: perPage };
      if (searchQuery.trim() !== "") params.search = searchQuery.trim();

      const res = await API.get("/jobs", { params });
      const payload = res.data || {};

      setJobs(payload.jobs || []);
      setTotalPages(payload.totalPages || 1);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchJobs();
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const applyJob = async (jobId) => {
    try {
      await API.post("/applications", { jobId });
      alert("Application submitted!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply");
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user || loading)
    return <div className="loading-screen">Loading jobs...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          activePage="jobs"
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />

        <main className="dashboard-main">
          <h1 className="dashboard-title" style={{color:"black"}}>Available Jobs</h1>

          <div className="job-search-bar">
            <input
              type="text"
              placeholder="Search jobs by title, company, location, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <>
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

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        className={`page-btn ${num === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(num)}
                      >
                        {num}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
