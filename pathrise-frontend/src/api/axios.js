import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const applyToJob = (jobId) =>
  API.post("/applications", { jobId });

export const getApplicationsByUser = (userId) =>
  API.get(`/applications/user/${userId}`);

export const getAllApplications = () =>
  API.get("/applications");

export const getMyProfile = () => API.get("/users/me");

export const updateMyProfile = (data) => API.put("/users/me", data);

export const getDashboardData = () => API.get("/dashboard");

export const getCandidateDashboardData = () => API.get("/candidate");

export const getJobs = () => API.get("/jobs");

export default API;
