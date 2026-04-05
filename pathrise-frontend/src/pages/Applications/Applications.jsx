import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  MapPin,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Building
} from "lucide-react";
import "./Applications.css";

export default function Applications() {
  const navigate = useNavigate();
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

    const userData = JSON.parse(storedUser);
    setUser(userData);

    fetchApplications(userData._id || userData.id);
  }, []);

  const fetchApplications = async (userId) => {
    setLoading(true);
    try {
      const res = await API.get(`/applications/user/${userId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching apps:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;

    try {
      await API.patch(`/applications/${appId}/cancel`);
      setApplications((prev) =>
        prev.map((item) =>
          item._id === appId ? { ...item, status: "Cancelled" } : item
        )
      );
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      case 'Cancelled': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      case 'Cancelled': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (!user) return null;

  return (
    <div className="candidate-dashboard">
      <Sidebar user={user} activePage="applications" />

      <main className="applications-main">
        <header className="applications-page-header">
          <h1 className="dashboard-title text-gradient">Track My Applications</h1>
          <p className="dashboard-subtitle">Monitor the progress of your job applications and interview status</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="animate-spin" style={{ display: 'inline-block' }}><Clock size={32} color="var(--primary)" /></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your applications...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                      You haven't applied to any jobs yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app?.job?.title || "Job Unavailable"}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <Building size={14} />
                          {app?.job?.company || "N/A"}
                        </div>
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.status !== "Cancelled" && app.status !== "Rejected" && app.status !== "Accepted" ? (
                          <button
                            className="cancel-action-btn"
                            onClick={() => handleCancel(app._id)}
                          >
                            Withdraw
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
