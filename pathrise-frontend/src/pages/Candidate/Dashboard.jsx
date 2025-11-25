import React from "react";
import Sidebar from "../../components/Sidebar";
import "../Home/Home.css"

export default function CandidateDashboard({ user }) {
  return (
    <div className="layout">
      <Sidebar user={user} activePage="dashboard" />
      <main className="main">
        <h1>Candidate Dashboard</h1>
        {/* Candidate widgets */}
      </main>
    </div>
  );
}
