import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building
} from "lucide-react";
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
      alert("Application submitted successfully!");
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

  if (!user) return null;

  return (
    <div className="jobs-container">
      <Sidebar user={user} activePage="jobs" />

      <main className="jobs-main">
        <header className="jobs-header">
          <h1 className="dashboard-title text-gradient">Explore Opportunities</h1>
          <p className="dashboard-subtitle">Find your next career move from our curated list of top tech roles</p>
        </header>

        <div className="job-search-wrapper">
          <Search size={18} />
          <input
            className="job-search-input"
            type="text"
            placeholder="Search by title, company, skills, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <Loader2 className="animate-spin" color="var(--primary)" size={32} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>We couldn't find any jobs matching your search.</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div className="job-card" key={job._id}>
                  <div className="job-card-top">
                    <div className="job-company-logo">
                      {job.company ? job.company[0].toUpperCase() : '?'}
                    </div>
                    <span className="job-type-pill">{job.type || 'N/A'}</span>
                  </div>

                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-company-name">
                    <Building size={14} />
                    {job.company || 'Unknown Company'}
                  </div>

                  <div className="job-meta">
                    <div className="job-meta-item">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="job-meta-item">
                      <Clock size={14} />
                      {job.createdAt ? 'Posted recently' : 'New'}
                    </div>
                  </div>

                  <div className="job-tags">
                    {job.skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="job-tag">{skill}</span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="job-tag">+{job.skills.length - 3} more</span>
                    )}
                  </div>

                  <div className="job-footer">
                    <div className="job-salary">
                      $80k - $120k
                    </div>
                    <button
                      className="btn-apply-job"
                      onClick={() => applyJob(job._id)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    className={`page-btn ${num === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
