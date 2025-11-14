import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      return navigate("/login"); // Protect route
    }

    setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="card">
      <h2 className="form-title">Welcome to Your Dashboard</h2>

      {user ? (
        <>
          <p className="small-muted">Hello, <b>{user.name}</b></p>
          <p>Your role: <b>{user.role}</b></p>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <button className="btn" style={{ marginTop: 20 }} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
