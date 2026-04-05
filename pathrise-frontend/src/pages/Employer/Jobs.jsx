import React, { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import { Search, Plus, MapPin, Briefcase, Code, Edit2, Trash2, Filter, X } from "lucide-react";
import "./Jobs.css";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    skills: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const perPage = 9;
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: perPage };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (typeFilter) params.type = typeFilter;
      if (locationFilter.trim()) params.location = locationFilter.trim();
      if (skillsFilter.trim()) params.skills = skillsFilter.trim();

      const res = await API.get("/jobs", { params });
      const payload = res.data || {};
      const jobsData = Array.isArray(payload.jobs)
        ? payload.jobs
        : Array.isArray(res.data)
        ? res.data
        : [];
      setJobs(jobsData);
      setTotalPages(
        payload.totalPages || Math.ceil((payload.totalJobs || jobsData.length) / perPage)
      );
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchJobs();
      return;
    }
    fetchJobs();
  }, [currentPage, typeFilter, locationFilter, skillsFilter]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchJobs();
    }, 450);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      if (editingJobId) await API.put(`/jobs/${editingJobId}`, payload);
      else await API.post("/jobs", payload);

      alert(editingJobId ? "Job updated successfully!" : "Job added successfully!");
      setForm({ title: "", company: "", location: "", type: "", skills: "", description: "" });
      setEditingJobId(null);
      setFormVisible(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save job");
    }
  };

  const handleEditClick = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      description: job.description || "",
    });
    setEditingJobId(job._id);
    setFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Job deleted!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete job");
    }
  };

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="employer-jobs-layout">
      <Sidebar user={user} activePage="jobs" />

      <main className="employer-jobs-main">
        <header className="jobs-header">
          <h1 className="dashboard-title text-gradient" style={{ fontSize: '2rem', marginBottom: '0.375rem' }}>Job Postings</h1>
          <p className="dashboard-subtitle" style={{ color: 'var(--text-secondary)' }}>Manage your open roles and requirements</p>
        </header>

        <div className="jobs-top-bar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              className="search-input"
              placeholder="Search title, company, location or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`btn-add-job ${formVisible ? 'btn-close' : ''}`}
            onClick={() => {
              setFormVisible((s) => !s);
              setEditingJobId(null);
            }}
          >
            {formVisible ? (
              <><X size={18} /> Close Form</>
            ) : (
              <><Plus size={18} /> Post New Job</>
            )}
          </button>
        </div>

        {formVisible && (
          <div className="job-form-container">
            <h2>{editingJobId ? "Edit Job Posting" : "Create New Job Posting"}</h2>
            <form className="job-form" onSubmit={handleAddOrUpdateJob}>
              <div className="form-group">
                <label>Job Title*</label>
                <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Senior Frontend Engineer" required />
              </div>
              <div className="form-group">
                <label>Company Display Name*</label>
                <input name="company" value={form.company} onChange={handleFormChange} placeholder="Company Name" required />
              </div>
              <div className="form-group">
                <label>Location*</label>
                <input name="location" value={form.location} onChange={handleFormChange} placeholder="e.g. Remote, San Francisco" required />
              </div>
              <div className="form-group">
                <label>Job Type*</label>
                <select name="type" value={form.type} onChange={handleFormChange} required>
                  <option value="">Select Type...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Required Skills (comma separated)</label>
                <input name="skills" value={form.skills} onChange={handleFormChange} placeholder="React, Node.js, TypeScript..." />
              </div>
              <div className="form-group full-width">
                <label>Job Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Detailed role description and requirements..." />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingJobId ? "Save Changes" : "Post Job"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setFormVisible(false);
                    setEditingJobId(null);
                    setForm({ title: "", company: "", location: "", type: "", skills: "", description: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="jobs-content">
          <div className="jobs-table-wrap">
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="animate-pulse">Loading jobs...</div>
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                <Briefcase size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>No job postings found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Role & Company</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Skills</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{job.company}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={14} color="var(--primary)" />
                            {job.location}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${job.type === 'Full-time' ? 'status-accepted' : 'status-pending'}`}>
                            {job.type}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Code size={14} color="var(--primary)" />
                            {Array.isArray(job.skills) && job.skills.length > 0 ? job.skills.join(", ") : "Not specified"}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn-icon edit" onClick={() => handleEditClick(job)} title="Edit Job">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(job._id)} title="Delete Job">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && !loading && (
              <div className="pagination-container">
                <button 
                  className="page-btn" 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage <= 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`page-btn ${p === currentPage ? "active" : ""}`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className="filters-sidebar">
            <h3><Filter size={18} /> Filters</h3>
            
            <div className="filter-group">
              <label>Job Type</label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                placeholder="e.g. Remote, NY"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="filter-group">
              <label>Required Skills</label>
              <input
                placeholder="e.g. React, Python"
                value={skillsFilter}
                onChange={(e) => {
                  setSkillsFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
