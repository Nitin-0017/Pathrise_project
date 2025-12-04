import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getMyProfile,
  getCandidateProfile,
  updateCandidateProfile,
  changePassword,
} from "../../api/axios";

import "./CandidateSettings.css";

export default function CandidateSettings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    skills: [],
    resume: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await getMyProfile();
        setUser(userRes.data);

        const profileRes = await getCandidateProfile();
        let skillsData = profileRes.data?.skills || [];

        // Ensure skills are always an array
        if (!Array.isArray(skillsData)) {
          try {
            skillsData = JSON.parse(skillsData);
          } catch {
            skillsData = [];
          }
        }

        setProfile({
          name: userRes.data?.name || "",
          email: userRes.data?.email || "",
          age: profileRes.data?.age || "",
          gender: profileRes.data?.gender || "",
          phone: profileRes.data?.phone || "",
          address: profileRes.data?.address || "",
          skills: skillsData,
          resume: profileRes.data?.resume || null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setProfile({ ...profile, resume: files[0] });
    } else if (name === "skills") {
      setProfile({ ...profile, skills: value.split(",").map((s) => s.trim()) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("age", profile.age);
      formData.append("gender", profile.gender);
      formData.append("phone", profile.phone);
      formData.append("address", profile.address);

      // FIX: append skills as array, not stringify
      profile.skills.forEach((skill) => {
        formData.append("skills[]", skill);
      });

      if (profile.resume instanceof File) {
        formData.append("resume", profile.resume);
      }

      await updateCandidateProfile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile Updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return alert("Passwords do not match!");

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Password Updated!");
      setIsModalOpen(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar user={user} activePage="settings" />

      <main className="main">
        <h2>Profile</h2>

        {!isEditing ? (
          <div className="profile-card">
            <div className="profile-avatar">{profile.name?.charAt(0)}</div>

            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>

            <p>
              <strong>Skills:</strong>{" "}
              {profile.skills.length ? profile.skills.join(", ") : "Not added"}
            </p>

            {profile.resume && <p><strong>Resume:</strong> Uploaded</p>}

            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            <button style={{ marginTop: "10px", backgroundColor: "#ef4444" }} onClick={() => setIsModalOpen(true)}>
              Change Password
            </button>
          </div>
        ) : (
          <div className="settings-container">

            <div className="setting-item">
              <label>Age</label>
              <input type="number" name="age" value={profile.age} onChange={handleProfileChange} />
            </div>

            <div className="setting-item">
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleProfileChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Phone</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} />
            </div>

            <div className="setting-item">
              <label>Address</label>
              <textarea name="address" value={profile.address} onChange={handleProfileChange}></textarea>
            </div>

            <div className="setting-item">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={profile.skills.join(", ")}
                onChange={handleProfileChange}
              />
            </div>

            <div className="setting-item">
              <label>Resume (PDF/DOCX)</label>
              <input type="file" name="resume" onChange={handleProfileChange} />
            </div>

            <button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button style={{ marginTop: "10px" }} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Change Password</h3>
              <input type="password" name="currentPassword" placeholder="Current Password" onChange={handlePasswordChange} />
              <input type="password" name="newPassword" placeholder="New Password" onChange={handlePasswordChange} />
              <input type="password" name="confirmPassword" placeholder="Confirm New Password" onChange={handlePasswordChange} />

              <button onClick={handlePasswordSave}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
