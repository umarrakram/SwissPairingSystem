import React, { useState, useEffect, useCallback } from 'react';
import { playerAPI } from '../../services/api';
import './PlayerManagement.css';

function PlayerManagement({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    rating: '',
    university: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await playerAPI.getByTournament(tournamentId);
      setPlayers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load players');
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await playerAPI.create({
        ...newPlayer,
        tournament: tournamentId,
        rating: parseInt(newPlayer.rating)
      });
      setSuccess('Player added successfully!');
      setShowAddModal(false);
      setNewPlayer({ name: '', rating: '', university: '' });
      fetchPlayers();
    } catch (err) {
      setError('Failed to add player');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadErrors([]);

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      const response = await playerAPI.bulkUpload(tournamentId, selectedFile);
      setSuccess(response.data.message);
      if (response.data.errors && response.data.errors.length > 0) {
        setUploadErrors(response.data.errors);
      }
      setShowBulkModal(false);
      setSelectedFile(null);
      fetchPlayers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDeletePlayer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }

    try {
      await playerAPI.delete(id);
      setSuccess('Player deleted successfully');
      fetchPlayers();
    } catch (err) {
      setError('Failed to delete player');
    }
  };

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  return (
    <div className="player-management">
      <div className="flex-between mb-20">
        <h3>Players ({players.length})</h3>
        <div className="flex-gap">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add Player
          </button>
          <button className="btn btn-success" onClick={() => setShowBulkModal(true)}>
            Bulk Upload
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {uploadErrors.length > 0 && (
        <div className="alert alert-error">
          <strong>Upload Errors:</strong>
          <ul>
            {uploadErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {players.length === 0 ? (
        <div className="card text-center">
          <h4>No players yet</h4>
          <p>Add players individually or upload an Excel file</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rating</th>
                <th>University</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player._id}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.rating}</td>
                  <td>{player.university}</td>
                  <td>{player.points}</td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePlayer(player._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Player</h2>
            <form onSubmit={handleAddPlayer}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <input
                  type="number"
                  min="0"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer({ ...newPlayer, rating: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>University *</label>
                <input
                  type="text"
                  value={newPlayer.university}
                  onChange={(e) => setNewPlayer({ ...newPlayer, university: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Bulk Upload Players</h2>
            <div className="upload-instructions">
              <p><strong>Excel File Format:</strong></p>
              <p>Your Excel file should have the following columns:</p>
              <ul>
                <li><strong>Name</strong> - Player's full name</li>
                <li><strong>Rating</strong> - Player's rating (number)</li>
                <li><strong>University</strong> - University name</li>
              </ul>
              <p className="note">Note: Column names are case-insensitive</p>
            </div>
            <form onSubmit={handleBulkUpload}>
              <div className="form-group">
                <label>Select Excel File (.xlsx, .xls) *</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                />
                {selectedFile && (
                  <p className="file-info">Selected: {selectedFile.name}</p>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerManagement;
