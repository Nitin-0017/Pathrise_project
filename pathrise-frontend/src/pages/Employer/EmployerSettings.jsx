import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API, { getEmployerProfile, updateEmployerProfile } from "../../api/axios";
import "../Settings.css";

export default function EmployerSettings() {
  const [user, setUser] = useState(null);
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
      try {
        const userRes = await getEmployerProfile(); // Fetch profile including user info
        setUser(userRes.data.user || {});
        setProfile({
          name: userRes.data.user?.name || "",
          email: userRes.data.user?.email || "",
          age: userRes.data.age || "",
          gender: userRes.data.gender || "",
          experience: userRes.data.experience || "",
          companyName: userRes.data.companyName || "",
          companyWebsite: userRes.data.companyWebsite || "",
          companyAddress: userRes.data.companyAddress || "",
          industry: userRes.data.industry || ""
        });
      } catch (err) {
        console.error(err);
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
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="layout">
      <Sidebar user={user} activePage="settings" />
      <main className="main">
        <h2>Employer Profile</h2>

        {!isEditing ? (
          <div className="profile-card">
            <div className="profile-avatar">{profile.name?.charAt(0)}</div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Experience:</strong> {profile.experience} years</p>
            <p><strong>Company:</strong> {profile.companyName}</p>
            <p><strong>Website:</strong> {profile.companyWebsite || "N/A"}</p>
            <p><strong>Address:</strong> {profile.companyAddress}</p>
            <p><strong>Industry:</strong> {profile.industry}</p>

            <div className="btn-row">
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          </div>
        ) : (
          <div className="settings-container">
            <div className="setting-item">
              <label>Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Age</label>
              <input type="number" name="age" value={profile.age} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Experience (years)</label>
              <input type="number" name="experience" value={profile.experience} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Company Name</label>
              <input type="text" name="companyName" value={profile.companyName} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Company Website</label>
              <input type="text" name="companyWebsite" value={profile.companyWebsite} onChange={handleChange} />
            </div>

            <div className="setting-item">
              <label>Company Address</label>
              <textarea name="companyAddress" value={profile.companyAddress} onChange={handleChange}></textarea>
            </div>

            <div className="setting-item">
              <label>Industry</label>
              <input type="text" name="industry" value={profile.industry} onChange={handleChange} />
            </div>

            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button style={{ marginTop: "10px" }} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
