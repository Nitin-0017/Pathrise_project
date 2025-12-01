import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Applications.css";

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

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
    try {
      const res = await API.get(`/applications/user/${userId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching apps:", err);
    }
  };

  const handleNavigate = (page) => {
    navigate(`/candidate/${page}`);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar
        user={user}
        activePage="applications"
        onNavigate={handleNavigate}
        onLogout={() => {
          localStorage.clear();
          navigate("/login");
        }}
      />
      <div className="content-area">
        <h2>My Applications</h2>

        <div className="applications-list">
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            applications.map((app) => (
              <div className="application-card" key={app._id}>
                <h3>{app?.job?.title || "Job deleted"}</h3>

                {/* Status Capsule + Text */}
                <div className="status-row">
                  <div
                    className={`status-pill status-${app.status.toLowerCase()}`}
                  ></div>
                  <span className="status-text">{app.status}</span>
                </div>

                <p>Applied on: {new Date(app.createdAt).toDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
