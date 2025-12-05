import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home/Home";
import CandidateJobs from "./pages/Jobs/Jobs";
import EmployerJobs from "./pages/Employer/Jobs";
import EmployerApplications from "./pages/Employer/EmployerApplications";
import Applications from "./pages/Applications/Applications";
import CandidateSettings from "./pages/Candidate/CandidateSettings";
import EmployerSettings from "./pages/Employer/EmployerSettings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute>
            <CandidateJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/settings"
        element={
          <ProtectedRoute>
            <CandidateSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute>
            <EmployerJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications"
        element={
          <ProtectedRoute>
            <EmployerApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/settings"
        element={
          <ProtectedRoute>
            <EmployerSettings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
