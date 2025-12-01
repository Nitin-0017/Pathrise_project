import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import "./Applications.css";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/employer");
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleContact = (app) => {
    updateStatus(app._id, "Accepted");
    window.location.href = `mailto:${app.applicant.email}`;
  };

  // Pagination logic
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApps = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

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

        {applications.length === 0 ? (
          <p className="no-applications">No applications yet.</p>
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
                  {currentApps.map((app) => (
                    <tr key={app._id}>
                      <td>{app?.applicant?.name || "No Name"}</td>
                      <td>{app?.applicant?.email || "No Email"}</td>
                      <td>{app?.applicant?.phone || "N/A"}</td>
                      <td>{app?.job?.title || "Unknown Job"}</td>

                      <td>
                        <span
                          className={`status-pill status-${app.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="actions">
                        {app.status !== "Accepted" && (
                          <button
                            className="contact-btn"
                            onClick={() => handleContact(app)}
                          >
                            Contact
                          </button>
                        )}
                        {app.status !== "Rejected" && (
                          <button
                            className="reject-btn"
                            onClick={() =>
                              updateStatus(app._id, "Rejected")
                            }
                          >
                            Reject
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
      </main>
    </div>
  );
}
