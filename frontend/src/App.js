import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import TournamentView from './components/Admin/TournamentView';
import UserView from './components/User/UserView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <header className="header">
            <div className="container">
              <div className="flex-between">
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <h1>♟️ Swiss Pairing System</h1>
                </Link>
                <nav className="flex-gap">
                  <Link to="/" className="btn btn-primary">Admin Dashboard</Link>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </header>
        )}

        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route path="/view/:shareLink" element={<UserView />} />

            {/* Protected Admin Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tournament/:id" 
              element={
                <ProtectedRoute>
                  <TournamentView />
                </ProtectedRoute>
              } 
            />

            {/* Redirect any other route to login if not authenticated */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
