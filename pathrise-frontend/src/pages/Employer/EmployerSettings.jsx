import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API, { getMyProfile, updateMyProfile } from "../../api/axios";
import "../Settings.css";

export default function EmployerSettings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMyProfile(); // using API helper
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMyProfile(form); // using API helper
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar user={user} activePage="settings" onLogout={() => window.location.reload()} />
      <main className="main">
        <h2>Profile Settings</h2>
        <div className="settings-container">
          <div className="profile-section">
            <div className="avatar-large">{user?.name ? user.name[0].toUpperCase() : "U"}</div>
            <h3>{user?.name || "User"}</h3>
            <p className="role">{user?.role || "Role"}</p>
          </div>

          <div className="setting-item">
            <label>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="setting-item">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
