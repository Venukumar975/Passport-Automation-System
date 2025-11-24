import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './components/LoginPage';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard.jsx';
import NewApplication from './components/NewApplication.jsx';
import UploadDocs from './components/UploadDocuments.jsx';
import ReviewApplication from './components/ReviewApplication.jsx';
import AdminDashboard from './AdminComponents/AdminDashboard.jsx';
import AdminVerification from './AdminComponents/AdminVerification.jsx';
import ViewApplication from './components/ViewApplication.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/applications" element={<UserDashboard />} />
             <Route path="/application/:id" element={<ViewApplication />} />
             <Route path="/newapplication" element={<NewApplication />} />
             <Route path="/uploaddocs" element={<UploadDocs />} />
             <Route path="/reviewapplication" element={<ReviewApplication />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
             <Route path="/admin-dashboard" element={<AdminDashboard />} />
             <Route path="/admin-verification/:id" element={<AdminVerification />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}