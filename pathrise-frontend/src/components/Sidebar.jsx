import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  Users,
  FileText,
  Menu,
  X,
  Settings
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ user, activePage }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const role = user?.role || "Candidate";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = {
    Candidate: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
      { id: 'jobs', label: 'Find Jobs', icon: Briefcase, path: '/candidate/jobs' },
      { id: 'applications', label: 'Applications', icon: FileText, path: '/candidate/applications' },
      { id: 'settings', label: 'Profile Settings', icon: Settings, path: '/candidate/settings' },
    ],
    Employer: [
      { id: 'dashboard', label: 'Recruiter Hub', icon: LayoutDashboard, path: '/employer/dashboard' },
      { id: 'jobs', label: 'My Postings', icon: Briefcase, path: '/employer/jobs' },
      { id: 'applications', label: 'Manage Applicants', icon: FileText, path: '/employer/applications' },
      { id: 'settings', label: 'Company Profile', icon: Settings, path: '/employer/settings' },
    ],
    Admin: [
      { id: 'dashboard', label: 'Admin Panel', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
      { id: 'jobs', label: 'Job Moderation', icon: Briefcase, path: '/admin/jobs' },
      { id: 'applications', label: 'Global Applications', icon: FileText, path: '/admin/applications' },
    ]
  };

  const currentNav = navItems[role] || [];

  return (
    <>
      <button className="mobile-nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          Path<span>Rise</span>
        </div>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "User"}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {currentNav.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout-item" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
