import React from "react";
import Sidebar from "../../components/Sidebar";
import "../Home/Home.css"

export default function AdminDashboard({ user }) {
  return (
    <div className="layout">
      <Sidebar user={user} activePage="dashboard" />
      <main className="main">
        <h1>Admin Dashboard</h1>
        {/* Admin widgets */}
      </main>
    </div>
  );
}
