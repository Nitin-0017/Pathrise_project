import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import {
  Search,
  Filter,
  ExternalLink,
  Check,
  X,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  XCircle,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import "./EmployerApplications.css";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debounceTimeout = useRef(null);
  const applicationsPerPage = 10;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/applications/employer", {
        params: {
          page: currentPage,
          limit: applicationsPerPage,
          search: searchTerm.trim(),
          status: statusFilter,
        },
      });

      setApplications(res.data.applications || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchApplications();
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="employer-dashboard">
      <Sidebar user={user} activePage="applications" />

      <main className="dashboard-main">
        <header className="applications-header">
          <h1 className="dashboard-title text-gradient">Application Tracker</h1>
          <p className="dashboard-subtitle">Review and manage candidates for your active job postings</p>
        </header>

        <div className="filters-wrapper">
          <div className="search-input-group">
            <Search size={18} />
            <input
              className="login-input"
              type="text"
              placeholder="Search by candidate name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="login-input status-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="animate-spin" style={{ display: 'inline-block' }}><Clock size={32} color="var(--primary)" /></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching applications...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job Position</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="sidebar-avatar" style={{ width: '32px', height: '32px' }}>
                              {app.applicant?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.applicant?.name}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{app.applicant?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                            <Briefcase size={14} color="var(--primary)" />
                            {app.job?.title}
                          </div>
                        </td>
                        <td>
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <span className={`status-pill status-${app.status.toLowerCase()}`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedApp(app);
                              setModalOpen(true);
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}


        {modalOpen && selectedApp && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="text-gradient" style={{ fontSize: '1.25rem', margin: 0 }}>Candidate Details</h3>
                <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="sidebar-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                    {selectedApp.applicant?.name?.[0]}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{selectedApp.applicant?.name}</h2>
                    <span className={`status-pill status-${selectedApp.status.toLowerCase()}`} style={{ marginTop: '0.25rem' }}>
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                <div className="modal-info-row">
                  <div className="modal-info-label"><Mail size={16} /> Email</div>
                  <div className="modal-info-value">{selectedApp.applicant?.email}</div>
                </div>

                <div className="modal-info-row">
                  <div className="modal-info-label"><Phone size={16} /> Phone</div>
                  <div className="modal-info-value">{selectedApp.applicant?.candidateProfile?.phone || "Not provided"}</div>
                </div>

                <div className="modal-info-row">
                  <div className="modal-info-label"><Briefcase size={16} /> Job</div>
                  <div className="modal-info-value">{selectedApp.job?.title}</div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--elevated-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div className="modal-info-label" style={{ marginBottom: '0.5rem' }}>Resume / Portfolio</div>
                  {selectedApp.applicant?.candidateProfile?.resume ? (
                    <a
                      href={`https://pathrise-project.onrender.com${selectedApp.applicant.candidateProfile.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-link"
                    >
                      View Profile Attachment <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>No resume uploaded by candidate.</p>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                {selectedApp.status === "Pending" ? (
                  <>
                    <button className="action-btn reject-btn" onClick={() => updateStatus(selectedApp._id, "Rejected")}>Reject Candidate</button>
                    <button className="action-btn accept-btn" onClick={() => updateStatus(selectedApp._id, "Accepted")}>Move to Next Stage</button>
                  </>
                ) : (
                  <button className="btn-secondary" onClick={() => setModalOpen(false)} style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>Close Details</button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
