import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getMyProfile,
  getCandidateProfile,
  updateCandidateProfile,
  changePassword,
} from "../../api/axios";
import {
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Shield,
  Edit3,
  Lock,
  FileText,
  Loader2,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

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

      const storedUser = localStorage.getItem("user");
      let userData = storedUser ? JSON.parse(storedUser) : null;

      try {
        const userRes = await getMyProfile();
        if (userRes.data) {
          userData = userRes.data;
        }
      } catch (err) {
        console.error("Failed to fetch user profile from API, using localStorage:", err);
      }

      setUser(userData);

      let profileData = {};
      try {
        const profileRes = await getCandidateProfile();
        profileData = profileRes.data || {};
      } catch (err) {
        console.error("Failed to fetch candidate profile:", err);
      }

      let skillsData = profileData?.skills || [];
      if (!Array.isArray(skillsData)) {
        try {
          skillsData = JSON.parse(skillsData);
        } catch {
          skillsData = [];
        }
      }

      setProfile({
        name: userData?.name || "",
        email: userData?.email || "",
        age: profileData?.age || "",
        gender: profileData?.gender || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
        skills: skillsData,
        resume: profileData?.resume || null,
      });

      setLoading(false);
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

  if (loading) {
    return (
      <div className="settings-loading">
        <Loader2 className="animate-spin" size={20} />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Sidebar user={user} activePage="settings" />

      <main className="settings-main">
        <header className="settings-header">
          <h1 className="dashboard-title text-gradient">Profile</h1>
          <p className="dashboard-subtitle">Manage your personal information and account settings</p>
        </header>

        {!isEditing ? (
          <div className="profile-view">

            <div className="profile-hero">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {profile.name?.charAt(0) ? (
                    <span className="avatar-initial">{profile.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User size={40} strokeWidth={1.5} />
                  )}
                </div>
                <div className="avatar-ring" />
                <button className="avatar-edit-btn" onClick={() => setIsEditing(true)} title="Edit profile">
                  <Edit3 size={14} />
                </button>
              </div>
              <h2 className="profile-name">{profile.name || "Your Name"}</h2>
              <p className="profile-email">
                {profile.email ? (
                  <><Mail size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{profile.email}</>
                ) : (
                  "No email set"
                )}
              </p>
              <div className="profile-role-pill">Candidate</div>
            </div>


            <div className="profile-info-grid">
              <div className="info-card">
                <div className="info-label"><Calendar size={12} /> Age</div>
                <div className={`info-value ${!profile.age ? 'empty' : ''}`}>
                  {profile.age || "Not specified"}
                </div>
              </div>
              <div className="info-card">
                <div className="info-label"><Shield size={12} /> Gender</div>
                <div className={`info-value ${!profile.gender ? 'empty' : ''}`}>
                  {profile.gender || "Not specified"}
                </div>
              </div>
              <div className="info-card">
                <div className="info-label"><Phone size={12} /> Phone</div>
                <div className={`info-value ${!profile.phone ? 'empty' : ''}`}>
                  {profile.phone || "Not added"}
                </div>
              </div>
              <div className="info-card">
                <div className="info-label"><MapPin size={12} /> Address</div>
                <div className={`info-value ${!profile.address ? 'empty' : ''}`}>
                  {profile.address || "Not added"}
                </div>
              </div>
            </div>


            <div className="profile-skills-card">
              <div className="info-label" style={{ marginBottom: 0 }}>Skills</div>
              <div className="skills-list">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">{skill}</span>
                  ))
                ) : (
                  <span className="info-value empty">No skills added yet</span>
                )}
              </div>
            </div>


            <div className="profile-resume-card">
              <div className="resume-icon">
                <FileText size={20} />
              </div>
              <div className="resume-info">
                <div className="resume-title">Resume</div>
                {profile.resume ? (
                  <div className="resume-status">
                    <CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    Uploaded
                  </div>
                ) : (
                  <div className="resume-not-uploaded">Not uploaded yet</div>
                )}
              </div>
            </div>


            <div className="profile-actions">
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="btn-change-password" onClick={() => setIsModalOpen(true)}>
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-form">
            <div className="form-section-title">Personal Information</div>

            <div className="form-grid">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={profile.age} onChange={handleProfileChange} placeholder="Enter your age" />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={profile.gender} onChange={handleProfileChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Enter your phone number" />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea name="address" value={profile.address} onChange={handleProfileChange} placeholder="Enter your address" />
              </div>
            </div>

            <div className="form-section-title">Professional Details</div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={profile.skills.join(", ")}
                  onChange={handleProfileChange}
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>

              <div className="form-group full-width">
                <label>Resume (PDF/DOCX)</label>
                <input type="file" name="resume" onChange={handleProfileChange} />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <><Loader2 className="animate-spin" size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Saving...</>
                ) : (
                  <><Save size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Save Profile</>
                )}
              </button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                <X size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Cancel
              </button>
            </div>
          </div>
        )}


        {isModalOpen && (
          <div className="password-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="password-modal" onClick={(e) => e.stopPropagation()}>
              <div className="password-modal-header">
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>

              <div className="password-modal-body">
                <div className="password-field">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" placeholder="Enter current password" onChange={handlePasswordChange} />
                </div>
                <div className="password-field">
                  <label>New Password</label>
                  <input type="password" name="newPassword" placeholder="Enter new password" onChange={handlePasswordChange} />
                </div>
                <div className="password-field">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Confirm new password" onChange={handlePasswordChange} />
                </div>
              </div>

              <div className="password-modal-footer">
                <button className="btn-save" onClick={handlePasswordSave}>
                  <Lock size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                  Update Password
                </button>
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
