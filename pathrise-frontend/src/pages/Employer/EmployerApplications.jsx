import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import "./Applications.css"; // can reuse your CSS

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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
          <p style={{ textAlign: "center" }}>No applications yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td>{app.applicant.name}</td>
                  <td>{app.applicant.email}</td>
                  <td>{app.applicant.phone || "N/A"}</td>
                  <td>{app.job.title}</td>
                  <td>
                    <a href={`mailto:${app.applicant.email}`}>
                      <button>Contact</button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
