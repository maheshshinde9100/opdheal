import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientOverview } from './pages/dashboard/PatientOverview';
import { PatientAppointments } from './pages/dashboard/PatientAppointments';
import { PatientDoctors } from './pages/dashboard/PatientDoctors';
import { PatientRecords } from './pages/dashboard/PatientRecords';
import { PatientBilling } from './pages/dashboard/PatientBilling';
import { PatientPrescriptions } from './pages/dashboard/PatientPrescriptions';
import { PatientProfile } from './pages/dashboard/PatientProfile';
import { PatientSettings } from './pages/dashboard/PatientSettings';
import { DoctorOverview } from './pages/dashboard/DoctorOverview';
import { DoctorPatients } from './pages/dashboard/DoctorPatients';
import { DoctorSchedule } from './pages/dashboard/DoctorSchedule';
import { DoctorRecords } from './pages/dashboard/DoctorRecords';
import { DoctorPrescriptions } from './pages/dashboard/DoctorPrescriptions';
import { DoctorProfile } from './pages/dashboard/DoctorProfile';
import { DoctorSettings } from './pages/dashboard/DoctorSettings';
import { AdminOverview } from './pages/dashboard/AdminOverview';
import { AdminDoctors } from './pages/dashboard/AdminDoctors';
import { AdminPatients } from './pages/dashboard/AdminPatients';
import { AdminAppointments } from './pages/dashboard/AdminAppointments';
import { AdminBilling } from './pages/dashboard/AdminBilling';
import { AdminSettings } from './pages/dashboard/AdminSettings';
import api from './services/api';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole
}) => {
  const isAuthenticated = api.isAuthenticated();
  const userRole = api.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to their respective dashboards if they have a role but trying to access another role's route
    switch (userRole) {
      case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
      case 'DOCTOR': return <Navigate to="/doctor/dashboard" replace />;
      case 'PATIENT': return <Navigate to="/patient/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/records"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/billing"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientBilling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientSettings />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/records"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/settings"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorSettings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/billing"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminBilling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect based on auth status */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

