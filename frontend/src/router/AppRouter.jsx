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
      {/* Логин */}
      <Route path="/login" element={<Login />} />

      {/* Главная — любой авторизованный */}
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

      {/* Пользователи — только админ */}
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

      {/* Курсы — ADMIN, COMMANDER, TEACHER, CADET */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute roles={["ADMIN", "COMMANDER", "TEACHER", "CADET"]}>
            <Layout>
              <CoursesPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Расписание — любой авторизованный */}
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

      {/* Посещаемость — теперь доступна и кадету (только просмотр) */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute roles={["ADMIN", "TEACHER", "COMMANDER", "CADET"]}>
            <Layout>
              <AttendancePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Дисциплина — ADMIN, COMMANDER, CADET */}
      <Route
        path="/discipline"
        element={
          <ProtectedRoute roles={["COMMANDER", "ADMIN", "CADET"]}>
            <Layout>
              <DisciplinePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Документы — любой авторизованный */}
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

      {/* Группы — ADMIN, COMMANDER */}
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
