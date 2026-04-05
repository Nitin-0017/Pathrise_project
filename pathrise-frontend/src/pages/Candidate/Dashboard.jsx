import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";
import API, { getCandidateDashboardData } from "../../api/axios";
import { FiBriefcase, FiFileText, FiClock, FiActivity, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { RiHistoryLine } from "react-icons/ri";

const ProfileStrength = ({ percentage }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="strength-meter-container">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke="var(--border)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="strength-meter-label">{percentage}%</div>
    </div>
  );
};

export default function CandidateDashboard({ user }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    jobsApplied: 0,
    interviewsScheduled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getCandidateDashboardData();
      setStats(res.data.stats);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityFeed = async () => {
    setFeedLoading(true);
    try {
      const res = await API.get("/candidate/activity");
      let feed = res.data.feed || res.data || [];

      feed = feed.filter(item =>
        item.message && !item.message.toLowerCase().includes("complete your profile")
      );
      setActivities(Array.isArray(feed) ? feed : []);
    } catch (err) {
      console.error("Feed Error:", err);
    } finally {
      setFeedLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    fetchDashboardData();
    fetchActivityFeed();
  }, []);

  if (loading) {
    return (
      <div className="candidate-dashboard">
        <Sidebar user={user} activePage="dashboard" />
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate-dashboard">
      <Sidebar user={user} activePage="dashboard" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title text-gradient">Hello, {user.name.split(' ')[0]}</h1>
          <p className="dashboard-subtitle">Track your job applications and upcoming interviews</p>
        </header>

        <section className="profile-strength-card">
          <ProfileStrength percentage={75} />
          <div className="strength-info">
            <h3 className="strength-title">Profile Strength: Advanced</h3>
            <p className="strength-desc">Your profile is more visible than 85% of job seekers. Complete your skill assessments to reach "Expert" status.</p>
          </div>
          <button className="strength-btn" onClick={() => navigate('/candidate/settings')}>
            Complete Profile
          </button>
        </section>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Applications</span>
              <div className="stat-icon"><FiFileText size={18} /></div>
            </div>
            <div className="stat-value">{stats.totalApplications}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Jobs Applied</span>
              <div className="stat-icon"><FiBriefcase size={18} /></div>
            </div>
            <div className="stat-value">{stats.jobsApplied}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Interviews</span>
              <div className="stat-icon" style={{ color: 'var(--warning)' }}><FiClock size={18} /></div>
            </div>
            <div className="stat-value">{stats.interviewsScheduled}</div>
          </div>
        </div>

        <section className="activity-section">
          <h2 className="activity-heading">
            <RiHistoryLine size={20} color="var(--primary)" />
            Recent Activity
          </h2>

          <div className="timeline">
            {feedLoading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading activity feed...</p>
            ) : activities.length > 0 ? (
              activities.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-main">
                      <div className="timeline-type">{item.type}</div>
                      <p className="timeline-message">{item.message}</p>
                    </div>
                    <div className="timeline-date">{timeAgo(item.createdAt)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <FiActivity size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>No recent activity found. Start applying!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
