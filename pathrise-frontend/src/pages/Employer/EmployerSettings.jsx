import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API, { getEmployerProfile, updateEmployerProfile } from "../../api/axios";
import { Mail, Briefcase, MapPin, Building, Activity, User, Edit3, Save, X, Globe } from "lucide-react";
import "./EmployerSettings.css";

export default function EmployerSettings() {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    experience: "",
    companyName: "",
    companyWebsite: "",
    companyAddress: "",
    industry: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {

      const storedUser = localStorage.getItem("user");
      let userData = storedUser ? JSON.parse(storedUser) : {};
      
      try {
        const userRes = await getEmployerProfile(); 
        if (userRes.data?.user) {
          userData = userRes.data.user;
        }
        setUser(userData);
        
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          age: userRes.data.age || "",
          gender: userRes.data.gender || "",
          experience: userRes.data.experience || "",
          companyName: userRes.data.companyName || "",
          companyWebsite: userRes.data.companyWebsite || "",
          companyAddress: userRes.data.companyAddress || "",
          industry: userRes.data.industry || ""
        });
      } catch (err) {
        console.error("Failed to fetch employer profile:", err);

        setUser(userData);
        setProfile((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || ""
        }));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEmployerProfile(profile);

      const currentStored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentStored, name: profile.name, email: profile.email }));
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="employer-settings-page">
      <Sidebar user={user} activePage="settings" />
      <div className="settings-main settings-loading">
        <div className="animate-spin"><Activity size={24} color="var(--primary)" /></div>
        Loading your profile...
      </div>
    </div>
  );

  return (
    <div className="employer-settings-page">
      <Sidebar user={user} activePage="settings" />
      
      <main className="settings-main">
        <header className="settings-header">
          <h1 className="dashboard-title text-gradient">Employer Settings</h1>
          <p className="dashboard-subtitle">Manage your personal profile and company details</p>
        </header>

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-hero">
              <div className="profile-avatar-wrapper">
                <div className="avatar-ring"></div>
                <div className="profile-avatar">
                  <span className="avatar-initial">
                    {profile.name ? profile.name.charAt(0) : "U"}
                  </span>
                </div>
                <button 
                  className="avatar-edit-btn" 
                  onClick={() => setIsEditing(true)} 
                  title="Edit Profile"
                >
                  <Edit3 size={14} />
                </button>
              </div>
              <h2 className="profile-name text-gradient">
                {profile.name || "Unknown User"}
              </h2>
              <div className="profile-email">
                <Mail size={14} />
                {profile.email || "No email set"}
              </div>
              <div className="profile-role-pill">
                <Briefcase size={14} style={{ marginRight: '6px' }} />
                Employer
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="info-card">
                <div className="info-label"><User size={14} /> Personal Info</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age</div>
                    <div className={!profile.age ? "info-value empty" : "info-value"}>{profile.age || "Not specified"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gender</div>
                    <div className={!profile.gender ? "info-value empty" : "info-value"}>{profile.gender || "Not specified"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</div>
                    <div className={!profile.experience ? "info-value empty" : "info-value"}>{profile.experience ? `${profile.experience} years` : "Not specified"}</div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-label"><Building size={14} /> Company Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Name</div>
                    <div className={!profile.companyName ? "info-value empty" : "info-value"}>{profile.companyName || "Not specified"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Industry</div>
                    <div className={!profile.industry ? "info-value empty" : "info-value"}>{profile.industry || "Not specified"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Website</div>
                    <div className={!profile.companyWebsite ? "info-value empty" : "info-value"} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {profile.companyWebsite ? <Globe size={12} color="var(--primary)" /> : null}
                      {profile.companyWebsite || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="info-card full-width">
                <div className="info-label"><MapPin size={14} /> Company Address</div>
                <div className={!profile.companyAddress ? "info-value empty" : "info-value"} style={{ marginTop: '0.5rem' }}>
                  {profile.companyAddress || "No address provided."}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit Profile Info
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-form">
            <h2 className="form-section-title"><User size={14} /> Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="e.g. 35" />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. 10" />
              </div>
            </div>

            <h2 className="form-section-title" style={{ marginTop: '2rem' }}><Building size={14} /> Company Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="companyName" value={profile.companyName} onChange={handleChange} placeholder="Acme Corp" />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input type="text" name="industry" value={profile.industry} onChange={handleChange} placeholder="e.g. Technology, Finance" />
              </div>

              <div className="form-group full-width">
                <label>Company Website</label>
                <input type="url" name="companyWebsite" value={profile.companyWebsite} onChange={handleChange} placeholder="https://www.example.com" />
              </div>

              <div className="form-group full-width">
                <label>Company Address</label>
                <textarea name="companyAddress" value={profile.companyAddress} onChange={handleChange} placeholder="Full headquarters address..."></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : <><Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> Save Profile</>}
              </button>
              <button className="btn-cancel" onClick={() => {
                setIsEditing(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}>
                <X size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
