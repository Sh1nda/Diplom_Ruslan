// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/UsersPage";
import SchedulePage from "../pages/SchedulePage";
import CoursesPage from "../pages/CoursesPage";
import AttendancePage from "../pages/AttendancePage";
import DisciplinePage from "../pages/DisciplinePage";
import DocumentsPage from "../pages/DocumentsPage";
import GroupsPage from "../pages/GroupsPage";


import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <UsersPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute roles={["ADMIN", "COMMANDER", "TEACHER"]}>
            <Layout>
              <CoursesPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Layout>
              <SchedulePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute roles={["TEACHER", "COMMANDER"]}>
            <Layout>
              <AttendancePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/discipline"
        element={
          <ProtectedRoute roles={["COMMANDER", "ADMIN"]}>
            <Layout>
              <DisciplinePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Layout>
              <DocumentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/groups"
  element={
    <ProtectedRoute roles={["ADMIN", "COMMANDER"]}>
      <Layout>
        <GroupsPage />
      </Layout>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}
