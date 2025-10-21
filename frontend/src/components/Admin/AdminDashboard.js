import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    totalRounds: 5
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentAPI.getAll();
      setTournaments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tournaments');
      setLoading(false);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await tournamentAPI.create(newTournament);
      setSuccess('Tournament created successfully!');
      setShowModal(false);
      setNewTournament({ name: '', date: '', totalRounds: 5 });
      fetchTournaments();
    } catch (err) {
      setError('Failed to create tournament');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This will delete all associated players and pairings.')) {
      return;
    }

    try {
      await tournamentAPI.delete(id);
      setSuccess('Tournament deleted successfully!');
      fetchTournaments();
    } catch (err) {
      setError('Failed to delete tournament');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading tournaments...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="flex-between mb-20">
        <h2>Tournament Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create New Tournament
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {tournaments.length === 0 ? (
        <div className="card text-center">
          <h3>No tournaments yet</h3>
          <p>Create your first tournament to get started</p>
        </div>
      ) : (
        <div className="tournaments-grid">
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="tournament-card">
              <div className="tournament-card-header">
                <h3>{tournament.name}</h3>
                <span className={`status-badge status-${tournament.status}`}>
                  {tournament.status}
                </span>
              </div>
              <div className="tournament-card-body">
                <p><strong>Date:</strong> {formatDate(tournament.date)}</p>
                <p><strong>Current Round:</strong> {tournament.currentRound} / {tournament.totalRounds}</p>
                <p className="share-link">
                  <strong>Share Link:</strong><br />
                  <code>{window.location.origin}/view/{tournament.shareLink}</code>
                </p>
              </div>
              <div className="tournament-card-actions">
                <Link to={`/tournament/${tournament._id}`} className="btn btn-primary">
                  Manage
                </Link>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteTournament(tournament._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Tournament</h2>
            <form onSubmit={handleCreateTournament}>
              <div className="form-group">
                <label>Tournament Name *</label>
                <input
                  type="text"
                  value={newTournament.name}
                  onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={newTournament.date}
                  onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Rounds</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTournament.totalRounds}
                  onChange={(e) => setNewTournament({ ...newTournament, totalRounds: parseInt(e.target.value) })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
