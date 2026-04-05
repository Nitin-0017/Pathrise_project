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
  CartesianGrid,
} from "recharts";
import { Briefcase, Users, FileText, TrendingUp, BarChart3, Clock } from "lucide-react";
import "./EmployerDashboard.css";
import { getDashboardData } from "../../api/axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        <p className="custom-tooltip-value">{`${payload[0].value} Applications`}</p>
      </div>
    );
  }
  return null;
};

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
      <div className="employer-dashboard">
        <Sidebar user={user} activePage="dashboard" />
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="animate-spin" style={{ marginBottom: '1rem' }}><Clock size={32} color="var(--primary)" /></div>
            <p style={{ color: 'var(--text-secondary)' }}>Preparing your recruiter hub...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="employer-dashboard">
      <Sidebar user={user} activePage="dashboard" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title text-gradient">Recruiter Overview</h1>
            <p className="dashboard-subtitle">Monitor your hiring pipeline and job performance</p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} />
            Data updated just now
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Total Postings</span>
              <div className="stat-icon"><Briefcase size={20} /></div>
            </div>
            <div className="stat-value">{stats.totalJobs}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Applications</span>
              <div className="stat-icon"><FileText size={20} /></div>
            </div>
            <div className="stat-value">{stats.totalApplications}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Active Candidates</span>
              <div className="stat-icon"><Users size={20} /></div>
            </div>
            <div className="stat-value">{stats.activeCandidates}</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">
              <TrendingUp size={18} color="var(--primary)" />
              Application Trends
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={applicationsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">
              <BarChart3 size={18} color="var(--secondary)" />
              Top Performing Jobs
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={applicationsPerJob}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="job" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="applications"
                    fill="var(--secondary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
