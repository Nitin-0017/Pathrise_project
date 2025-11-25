import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Candidate applies to job
export const applyToJob = (jobId) =>
  API.post("/applications", { jobId });

// Candidate gets their own applications
export const getApplicationsByUser = (userId) =>
  API.get(`/applications/user/${userId}`);

// Employer/Admin gets all applications
export const getAllApplications = () =>
  API.get("/applications");

export default API;
