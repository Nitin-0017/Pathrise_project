import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Candidate" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, form);
      setLoading(false);
      setSuccess("Signup successful — logging you in...");
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="card">
      <div className="form-title">Create your account</div>
      <div className="small-muted">Sign up as Candidate or Employer</div>

      {error && <div className="alert">{error}</div>}
      {success && <div style={{background:"#ecfdf5", color:"#065f46", padding:"8px 10px", borderRadius:8, marginBottom:12}}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <input className="input" name="name" placeholder="Full name" value={form.name} onChange={onChange} />
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} />
        <select className="input" name="role" value={form.role} onChange={onChange}>
          <option value="Candidate">Candidate</option>
          <option value="Employer">Employer</option>
        </select>

        <button className="btn" type="submit" disabled={loading}>{loading ? "Signing up..." : "Create account"}</button>
      </form>

      <div className="link-row">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
