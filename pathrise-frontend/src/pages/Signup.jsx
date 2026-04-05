import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import "./Signup.css";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL if present (e.g. from Landing Page CTAs)
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get("role") || "Candidate";

  const [form, setForm] = useState({ name: "", email: "", password: "", role: initialRole });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (initialRole) {
      setForm(prev => ({ ...prev, role: initialRole }));
    }
  }, [initialRole]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const setRole = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/signup`, form);
      setLoading(false);
      setSuccess("Account created successfully! Redirecting...");

      const { token, user } = res.data;
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        if (form.role === "Employer") {
          navigate("/employer/dashboard");
        } else {
          navigate("/candidate/dashboard");
        }
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title text-gradient">Create account</h1>
          <p className="signup-subtitle">Join Pathrise and accelerate your career</p>
        </div>

        <div className="role-selector">
          <div
            className={`role-option ${form.role === 'Candidate' ? 'active' : ''}`}
            onClick={() => setRole('Candidate')}
          >
            Candidate
          </div>
          <div
            className={`role-option ${form.role === 'Employer' ? 'active' : ''}`}
            onClick={() => setRole('Employer')}
          >
            Employer
          </div>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert-success">
            <CheckCircle2 size={16} style={{ marginBottom: -3, marginRight: 8, display: 'inline' }} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="name"
                className="signup-input"
                style={{ paddingLeft: '40px' }}
                name="name"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                className="signup-input"
                style={{ paddingLeft: '40px' }}
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={form.email}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                className="signup-input"
                style={{ paddingLeft: '40px' }}
                type="password"
                name="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={form.password}
                onChange={onChange}
              />
            </div>
          </div>

          <button className="btn-signup" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
