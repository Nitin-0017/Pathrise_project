import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./CandidateDashboard.css";
import { getCandidateDashboardData } from "../../api/axios";

export default function CandidateDashboard({ user }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    jobsApplied: 0,
    interviewsScheduled: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getCandidateDashboardData();
      const stats = res.data.stats;
      setStats(stats);
    } catch (err) {
      console.error("Candidate Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar user={user} activePage="dashboard" />
        <div className="dashboard-main">
          <h1 className="dashboard-title">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-layout">
        <Sidebar user={user} activePage="dashboard" />

        <main className="dashboard-main">
          <h1 className="dashboard-title">Candidate Dashboard</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search jobs, applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="card">
              <h3>Total Applications</h3>
              <p>{stats.totalApplications}</p>
            </div>
            <div className="card">
              <h3>Jobs Applied</h3>
              <p>{stats.jobsApplied}</p>
            </div>
            <div className="card">
              <h3>Interviews Scheduled</h3>
              <p>{stats.interviewsScheduled}</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
