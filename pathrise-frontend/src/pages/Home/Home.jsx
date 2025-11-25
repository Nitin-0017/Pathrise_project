import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateDashboard from "../Candidate/Dashboard";
import EmployerDashboard from "../Employer/Dashboard";
import AdminDashboard from "../Admin/Dashboard";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  if (user.role === "Candidate") return <CandidateDashboard user={user} />;
  if (user.role === "Employer") return <EmployerDashboard user={user} />;
  if (user.role === "Admin") return <AdminDashboard user={user} />;

  return <div>Role not recognized</div>;
}
