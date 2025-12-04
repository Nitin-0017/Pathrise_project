import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Applications
export const applyToJob = (jobId) =>
  API.post("/applications", { jobId });

export const getApplicationsByUser = (userId) =>
  API.get(`/applications/user/${userId}`);

export const getAllApplications = () =>
  API.get("/applications");

export const cancelApplication = (appId) =>
  API.patch(`/applications/${appId}/cancel`);

// User Profile (Self)
export const getMyProfile = () => API.get("/users/me");
export const updateMyProfile = (data) =>
  API.put("/users/me", data);

// Dashboard
export const getDashboardData = () => API.get("/dashboard");
export const getCandidateDashboardData = () => API.get("/candidate");

// Password
export const changePassword = (data) =>
  API.post("/users/change-password", data);

// Candidate (Self)
export const getCandidateProfile = () => API.get("/candidate/profile");
export const updateCandidateProfile = (data) =>
  API.post("/candidate/profile", data);

// Employer (Self)
export const getEmployerProfile = () => API.get("/employer/profile");
export const updateEmployerProfile = (data) =>
  API.post("/employer/profile", data);

// 🚀 NEW: Get Candidate Profile By ID (For Employers)
export const getCandidateProfileById = (candidateId) =>
  API.get(`/candidate/profile/${candidateId}`);

export default API;
