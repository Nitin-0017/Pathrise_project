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
import { getDashboardData } from "../../api/axios";  

export default function EmployerDashboard({ user }) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeCandidates: 0,
  });

  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [applicationsPerJob, setApplicationsPerJob] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        setStats(res.data.stats);
        setApplicationsOverTime(res.data.applicationsOverTime);
        setApplicationsPerJob(res.data.applicationsPerJob);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
        setLoading(false);
      });
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
          <h1 className="dashboard-title" style={{color:"black"}}>Employer Dashboard</h1>

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
                  <Bar
                    dataKey="applications"
                    fill="#0a66c2"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
