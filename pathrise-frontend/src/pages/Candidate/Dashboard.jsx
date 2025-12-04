import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";
import API, { getCandidateDashboardData } from "../../api/axios";

// React Icons
import { FiBriefcase, FiFileText, FiClock, FiActivity } from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiChatHistoryLine } from "react-icons/ri";

export default function CandidateDashboard({ user }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    jobsApplied: 0,
    interviewsScheduled: 0,
  });

  const [loading, setLoading] = useState(true);

  // ACTIVITY FEED STATE
  const [activities, setActivities] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(null);

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
    setFeedError(null);
    try {
      const res = await API.get("/candidate/activity");
      let feed = res.data.feed || res.data || [];

      // 💥 FIX: Remove unwanted backend messages like “complete your profile”
      feed = feed.filter(
        (item) =>
          item.message &&
          !item.message.toLowerCase().includes("complete your profile")
      );

      setActivities(Array.isArray(feed) ? feed : []);
    } catch (err) {
      console.error("Feed Error:", err);
      setFeedError("Unable to load activity feed.");
    } finally {
      setFeedLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
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
      <div className="dashboard-wrapper">
        <div className="dashboard-layout">
          <Sidebar user={user} activePage="dashboard" />
          <div className="dashboard-main">
            <h1 className="dashboard-title">Loading your dashboard...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-layout">
        <Sidebar user={user} activePage="dashboard" />

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title" style={{color:"black"}} >Candidate Dashboard</h1>
          </div>

          {/* ==================== STATS ====================== */}
          <div className="stats-cards">
            <div className="card cool-card">
              <div className="card-icon">
                <FiFileText size={26} />
              </div>
              <h3>Total Applications</h3>
              <p>{stats.totalApplications}</p>
            </div>

            <div className="card cool-card">
              <div className="card-icon">
                <FiBriefcase size={26} />
              </div>
              <h3>Jobs Applied</h3>
              <p>{stats.jobsApplied}</p>
            </div>

            <div className="card cool-card">
              <div className="card-icon orange">
                <MdOutlinePendingActions size={26} />
              </div>
              <h3>Interviews</h3>
              <p>{stats.interviewsScheduled}</p>
            </div>
          </div>

          {/* ============== ACTIVITY FEED ================== */}
          <div className="activity-feed">
            <h2 className="activity-heading">
              <RiChatHistoryLine size={22} style={{ marginRight: 8 }} />
              Recent Activity
            </h2>

            {feedLoading && <p>Loading activity...</p>}
            {feedError && <p className="feed-error">{feedError}</p>}

            <div className="feed-cards">
              {!feedLoading &&
                activities.map((item, index) => (
                  <div
                    key={index}
                    className={`feed-card ${item.type?.toLowerCase()}`}
                  >
                    {/* ICON BASED ON TYPE */}
                    <div className="feed-icon">
                      {item.type === "Application" && <FiFileText size={22} />}
                      {item.type === "Interview" && <FiClock size={22} />}
                      {item.type === "Review" && <FiActivity size={22} />}
                    </div>

                    <div className="feed-body">
                      <p className="feed-message">
                        <strong>{item.type}:</strong> {item.message}
                      </p>
                      <span className="feed-meta">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}

              {!feedLoading && activities.length === 0 && (
                <p className="no-activity">No recent activity.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
