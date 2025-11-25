import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "./EmployerDashboard.css";

export default function EmployerDashboard({ user }) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeCandidates: 0,
    revenue: 0,
  });
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [applicationsPerJob, setApplicationsPerJob] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setApplicationsOverTime(data.applicationsOverTime);
        setApplicationsPerJob(data.applicationsPerJob);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard-wrapper"> {/* FIX: override centering */}
      <div className="dashboard-layout">
        <Sidebar user={user} activePage="dashboard" />
        <main className="dashboard-main">
          <h1 className="dashboard-title">Employer Dashboard</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search jobs, candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="stats-cards">
            <div className="card">
              <h3>Total Jobs</h3>
              <p>{stats.totalJobs}</p>
            </div>
            <div className="card">
              <h3>Total Applications</h3>
              <p>{stats.totalApplications}</p>
            </div>
            <div className="card">
              <h3>Active Candidates</h3>
              <p>{stats.activeCandidates}</p>
            </div>
            <div className="card">
              <h3>Revenue</h3>
              <p>${stats.revenue}</p>
            </div>
          </div>

          <div className="charts">
            <div className="chart-container">
              <h3>Applications Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationsOverTime}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0a66c2"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Applications Per Job</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationsPerJob}>
                  <XAxis dataKey="job" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#0a66c2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
