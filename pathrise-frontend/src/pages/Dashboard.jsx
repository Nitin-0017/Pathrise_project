import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) return navigate("/login");

    setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="loading-screen">Loading...</div>;

  return (
  <div className="dashboard-container">

    {/* LEFT SIDEBAR */}
    <aside className="sidebar">
      <div className="profile-section">
        <div className="avatar">{user.name[0].toUpperCase()}</div>
        <h3>{user.name}</h3>
        <p className="role">{user.role}</p>
      </div>

      <nav className="menu">
        <button className="menu-item active">Dashboard</button>
        <button className="menu-item">My Applications</button>
        <button className="menu-item">Messages</button>
        <button className="menu-item">Settings</button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <main className="main-content">
      <h1>Welcome back, {user.name.split(" ")[0]} 👋</h1>
      <p className="subtext">Here’s what’s happening today</p>

      <div className="cards">
        <div className="card-box">
          <h2>Applications</h2>
          <p>Track your applied jobs</p>
        </div>

        <div className="card-box">
          <h2>Messages</h2>
          <p>Connect with recruiters</p>
        </div>

        <div className="card-box">
          <h2>Profile</h2>
          <p>Improve your hiring chances</p>
        </div>
      </div>
    </main>
  </div>
  )
}