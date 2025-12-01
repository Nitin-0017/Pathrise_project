import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getMyProfile, updateMyProfile, changePassword } from "../../api/axios";
import "../Settings.css";

export default function CandidateSettings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For password modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMyProfile();
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
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
      const payload = { name: form.name, email: form.email };
      const res = await updateMyProfile(payload);
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Password modal handlers
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Please fill all fields");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
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
            <div className="avatar-large">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h3>{user?.name || "User"}</h3>
            <p className="role">{user?.role || "Role"}</p>
          </div>

          {/* Name */}
          <div className="setting-item">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="setting-item">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* Change Password Button */}
          <button 
            style={{ marginTop: "15px", backgroundColor: "#ef4444" }} 
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </button>

          {/* Password Modal */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Change Password</h3>

                <div className="setting-item">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="setting-item">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="setting-item">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button onClick={handlePasswordSave} disabled={passwordSaving}>
                    {passwordSaving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
