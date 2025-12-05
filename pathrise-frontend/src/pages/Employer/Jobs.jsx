import React, { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
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

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar
        user={user}
        activePage="jobs"
        onLogout={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      />

      <main className="main">
        <h1 className="dashboard-title" style={{color:"black"}}>My Jobs</h1>
        <div className="jobs-top-bar">
          <input
            className="search-input"
            placeholder="Search title, company, location or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn-add-job"
            onClick={() => {
              setFormVisible((s) => !s);
              setEditingJobId(null);
            }}
          >
            {formVisible ? "Close" : "+ Job"}
          </button>
        </div>
        {formVisible && (
          <div className="job-form-container">
            <h2>{editingJobId ? "Edit Job" : "Add New Job"}</h2>
            <form className="job-form" onSubmit={handleAddOrUpdateJob}>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Job Title"
                required
              />
              <input
                name="company"
                value={form.company}
                onChange={handleFormChange}
                placeholder="Company Name"
                required
              />
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder="Location"
                required
              />
              <input
                name="type"
                value={form.type}
                onChange={handleFormChange}
                placeholder="Full-time / Part-time"
                required
              />
              <input
                name="skills"
                value={form.skills}
                onChange={handleFormChange}
                placeholder="Skills (comma separated)"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Job Description"
              />
              <div className="form-buttons">
                <button type="submit">{editingJobId ? "Update Job" : "Add Job"}</button>
                <button
                  type="button"
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
                      <td>{Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || ""}</td>
                      <td className="btns">
                        <button className="edit-btn" onClick={() => handleEditClick(job)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(job._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={p === currentPage ? "active-page" : ""}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next
              </button>
            </div>
          </div>

          <div className="filters-sidebar">
            <h3>Filters</h3>

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

            <label>Location</label>
            <input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            />

            <label>Skills</label>
            <input
              placeholder="Skills (comma separated)"
              value={skillsFilter}
              onChange={(e) => {
                setSkillsFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
