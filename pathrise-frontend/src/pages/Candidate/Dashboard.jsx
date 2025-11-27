import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";
import { getCandidateDashboardData, getJobs } from "../../api/axios"; // ✅ getJobs API

export default function CandidateDashboard({ user }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    jobsApplied: 0,
    interviewsScheduled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [jobsView, setJobsView] = useState(false); // toggle jobs view
  const [jobs, setJobs] = useState([]); // all jobs
  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [filteredJobs, setFilteredJobs] = useState([]);

  const navigate = useNavigate();

  // Fetch dashboard stats
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

  // Fetch jobs when Browse Jobs clicked
  const fetchJobs = async () => {
    try {
      const res = await getJobs(); // API should return list of jobs
      setJobs(res.data.jobs);
      setFilteredJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // Filter jobs on search
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, jobs]);

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
          {/* Header with Browse Jobs Button */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Candidate Dashboard</h1>
            <button
              className="browse-jobs-btn"
              onClick={() => {
                setJobsView(true);
                fetchJobs();
              }}
            >
              Browse Jobs
            </button>
          </div>

          {/* Conditional Search Bar + Job List */}
          {jobsView && (
            <>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="job-list">
                {filteredJobs.length === 0 ? (
                  <p>No jobs found</p>
                ) : (
                  filteredJobs.map((job) => (
                    <div key={job._id} className="job-card">
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                      <p>{job.location}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Dashboard stats + activity feed when not in jobs view */}
          {!jobsView && (
            <>
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

              {/* Activity Feed */}
              <div className="activity-feed">
                <h2>Recent Activity & Reviews</h2>
                <div className="feed-cards">
                  <div className="feed-card">
                    <p>
                      <strong>Application:</strong> Applied to Frontend
                      Developer at XYZ Corp
                    </p>
                    <span>2 days ago</span>
                  </div>
                  <div className="feed-card">
                    <p>
                      <strong>Interview:</strong> Scheduled for Backend
                      Developer at ABC Inc
                    </p>
                    <span>5 days ago</span>
                  </div>
                  <div className="feed-card">
                    <p>
                      <strong>Review:</strong> Your profile is 85% complete. Add
                      more skills to improve visibility.
                    </p>
                    <span>1 week ago</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
