import React from "react";
import Sidebar from "../../components/Sidebar";
import "../Home/Home.css"

export default function EmployerDashboard({ user }) {
  return (
    <div className="layout">
      <Sidebar user={user} activePage="dashboard" />
      <main className="main">
        <h1>Employer Dashboard</h1>
        {/* Employer widgets */}
      </main>
    </div>
  );
}
