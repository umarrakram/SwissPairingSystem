import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import TournamentView from './components/Admin/TournamentView';
import UserView from './components/User/UserView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="flex-between">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1>♟️ Swiss Pairing System</h1>
              </Link>
              <nav className="flex-gap">
                <Link to="/" className="btn btn-primary">Admin Dashboard</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/tournament/:id" element={<TournamentView />} />
            <Route path="/view/:shareLink" element={<UserView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
