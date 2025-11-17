import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to={redirectTo} replace />;

    return children;
  } catch (err) {
    console.error("ProtectedRoute Error:", err);
    return <Navigate to={redirectTo} replace />;
  }
}
