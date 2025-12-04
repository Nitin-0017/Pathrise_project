import React, { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
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
  const isFirstRender = useRef(true);
  const applicationsPerPage = 10;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/applications/employer", {
        params: {
          page: currentPage,
          limit: applicationsPerPage,
          search: searchTerm,
          status: statusFilter,
        },
      });

      setApplications(res.data.applications);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Handle Pagination + Status Filter changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchApplications();
    // eslint-disable-next-line
  }, [currentPage, statusFilter]);

  // Debounced Search FIXED (focus not getting lost)
  useEffect(() => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (!isFirstRender.current) {
        fetchApplications();
      }
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
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

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar
        user={user}
        activePage="applications"
        onLogout={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      />

      <main className="main">
        <h2>Applications for My Jobs</h2>

        {/* Search + Filter */}
        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search candidate..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {applications.length === 0 ? (
          <p className="no-applications">No applications found.</p>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>{app?.applicant?.name || "No Name"}</td>
                      <td>{app?.applicant?.email || "No Email"}</td>
                      <td>{app?.applicant?.phone || "N/A"}</td>
                      <td>{app?.job?.title || "Unknown Job"}</td>
                      <td>
                        <span
                          className={`app-status-pill app-status-${app.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="actions">
                        {app.status === "Accepted" ||
                        app.status === "Rejected" ? (
                          <span
                            className={`app-status-pill app-status-${app.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {app.status}
                          </span>
                        ) : (
                          <button
                            className="view-btn"
                            onClick={() => {
                              setSelectedApp(app);
                              setModalOpen(true);
                            }}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {modalOpen && selectedApp && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedApp?.applicant?.name}</h3>
              <p>
                <strong>Email:</strong> {selectedApp?.applicant?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp?.applicant?.phone}
              </p>
              <p>
                <strong>Job Title:</strong> {selectedApp?.job?.title}
              </p>
              <p>
                <strong>Resume:</strong>{" "}
                {selectedApp?.applicant?.resume ? (
                  <a
                    href={selectedApp.applicant.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  "No resume uploaded"
                )}
              </p>

              <div className="modal-actions">
                <button
                  className="contact-btn"
                  onClick={() => updateStatus(selectedApp._id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updateStatus(selectedApp._id, "Rejected")}
                >
                  Reject
                </button>
                <button onClick={() => setModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
