import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      const { token, user } = res.data;

      // Save token + user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setLoading(false);

      // Redirect by role to dashboard
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "Employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }

    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <div className="form-title">Login to Pathrise</div>
      <div className="small-muted">Use your account to continue</div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="link-row">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
