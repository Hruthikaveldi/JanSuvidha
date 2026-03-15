import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checker from './pages/Checker';
import Browse from './pages/Browse';
import History from './pages/History';
import NotFound from './pages/NotFound';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/checker"   element={<PrivateRoute><Checker /></PrivateRoute>} />
          <Route path="/browse"    element={<PrivateRoute><Browse /></PrivateRoute>} />
          <Route path="/history"   element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
