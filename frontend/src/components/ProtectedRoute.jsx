import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { token, role, loading } = useAuth();

  if (loading) return null; // ждём загрузки токена

  if (!token) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
