import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  Users,
  FileText
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ user, activePage, onLogout }) {
  const navigate = useNavigate();
  const role = user.role;


  return (
    <aside className="sidebar">
      <h2 className="logo">Pathrise</h2>
      <div className="profile">
        <div className="avatar">{user.name[0].toUpperCase()}</div>
        <h3>{user.name}</h3>
        <p className="role">{role}</p>
      </div>

      <nav className="menu">
        <button
          className={`menu-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => navigate(`/${role.toLowerCase()}`)}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        {role === "Candidate" && (
          <>
            <button
              className={`menu-item ${activePage === "jobs" ? "active" : ""}`}
              onClick={() => navigate("/candidate/jobs")}
            >
              <Briefcase size={18} /> Jobs
            </button>
            <button
              className={`menu-item ${activePage === "applications" ? "active" : ""}`}
              onClick={() => navigate("/candidate/applications")}
            >
              <FileText size={18} /> My Applications
            </button>
            <button
              className={`menu-item ${activePage === "settings" ? "active" : ""}`}
              onClick={() => navigate("/candidate/settings")}
            >
              <Settings size={18} /> Settings
            </button>
          </>
        )}

        {role === "Employer" && (
          <>
            <button
              className={`menu-item ${activePage === "jobs" ? "active" : ""}`}
              onClick={() => navigate("/employer/jobs")}
            >
              <Briefcase size={18} /> My Job Postings
            </button>
            <button
              className={`menu-item ${activePage === "applications" ? "active" : ""}`}
              onClick={() => navigate("/employer/applications")}
            >
              
              <FileText size={18} /> Applications
            </button>
            <button
              className={`menu-item ${activePage === "settings" ? "active" : ""}`}
              onClick={() => navigate("/employer/settings")}
            >
              <Settings size={18} /> Settings
            </button>
          </>
        )}

        {role === "Admin" && (
          <>
            <button
              className={`menu-item ${activePage === "users" ? "active" : ""}`}
              onClick={() => navigate("/admin/users")}
            >
              <Users size={18} /> Manage Users
            </button>
            <button
              className={`menu-item ${activePage === "jobs" ? "active" : ""}`}
              onClick={() => navigate("/admin/jobs")}
            >
              <Briefcase size={18} /> All Jobs
            </button>
            <button
              className={`menu-item ${activePage === "applications" ? "active" : ""}`}
              onClick={() => navigate("/admin/applications")}
            >
              <FileText size={18} /> All Applications
            </button>
          </>
        )}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
