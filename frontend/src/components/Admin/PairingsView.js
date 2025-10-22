import React, { useState, useEffect, useCallback } from 'react';
import { pairingAPI } from '../../services/api';
import './PairingsView.css';

function PairingsView({ tournamentId, tournament }) {
  const [selectedRound, setSelectedRound] = useState(tournament.currentRound);
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTime, setEditingTime] = useState({});

  const fetchPairings = useCallback(async () => {
    try {
      const response = await pairingAPI.getByTournamentAndRound(tournamentId, selectedRound);
      setPairings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pairings');
      setLoading(false);
    }
  }, [tournamentId, selectedRound]);

  useEffect(() => {
    if (selectedRound > 0) {
      fetchPairings();
    } else {
      setLoading(false);
    }
  }, [selectedRound, fetchPairings]);

  const handleResultChange = async (pairingId, result) => {
    setError('');
    setSuccess('');

    try {
      await pairingAPI.updateResult(pairingId, result);
      setSuccess('Result updated successfully');
      fetchPairings();
    } catch (err) {
      setError('Failed to update result');
    }
  };

  const handleScheduleTime = async (pairingId, scheduledTime) => {
    setError('');
    setSuccess('');

    try {
      await pairingAPI.updateSchedule(pairingId, scheduledTime);
      setSuccess('Match time updated successfully');
      setEditingTime({});
      fetchPairings();
    } catch (err) {
      setError('Failed to update match time');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultClass = (result) => {
    if (result === '1-0' || result === '1-0F') return 'result-white';
    if (result === '0-1' || result === '0-1F') return 'result-black';
    if (result === '0.5-0.5') return 'result-draw';
    return 'result-pending';
  };

  if (tournament.currentRound === 0) {
    return (
      <div className="card text-center">
        <h3>No pairings yet</h3>
        <p>Generate pairings for Round 1 to get started</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading pairings...</div>;
  }

  const rounds = Array.from({ length: tournament.currentRound }, (_, i) => i + 1);

  return (
    <div className="pairings-view">
      <div className="flex-between mb-20">
        <h3>Round Pairings</h3>
        <div className="round-selector">
          <label>Select Round: </label>
          <select 
            value={selectedRound} 
            onChange={(e) => setSelectedRound(parseInt(e.target.value))}
          >
            {rounds.map(round => (
              <option key={round} value={round}>Round {round}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {pairings.length === 0 ? (
        <div className="card text-center">
          <p>No pairings found for Round {selectedRound}</p>
        </div>
      ) : (
        <div className="pairings-list">
          {pairings.map((pairing) => (
            <div key={pairing._id} className="pairing-card card">
              <div className="pairing-header">
                <span className="board-number">Board {pairing.board}</span>
                <div className="header-right">
                  <span className="scheduled-time">
                    🕐 {formatDateTime(pairing.scheduledTime)}
                  </span>
                  <span className={`result-badge ${getResultClass(pairing.result)}`}>
                    {pairing.result === 'pending' ? 'Pending' : pairing.result}
                  </span>
                </div>
              </div>
              
              <div className="pairing-body">
                <div className="player white-player">
                  <span className="player-color">⚪</span>
                  <div className="player-info">
                    <strong>{pairing.whitePlayer?.name || 'Unknown'}</strong>
                    <span className="player-details">
                      Rating: {pairing.whitePlayer?.rating} | 
                      {pairing.whitePlayer?.university} | 
                      Points: {pairing.whitePlayer?.points}
                    </span>
                  </div>
                </div>

                <div className="vs">VS</div>

                <div className="player black-player">
                  <span className="player-color">⚫</span>
                  <div className="player-info">
                    {pairing.blackPlayer ? (
                      <>
                        <strong>{pairing.blackPlayer.name}</strong>
                        <span className="player-details">
                          Rating: {pairing.blackPlayer.rating} | 
                          {pairing.blackPlayer.university} | 
                          Points: {pairing.blackPlayer.points}
                        </span>
                      </>
                    ) : (
                      <strong className="bye">BYE (Full Point)</strong>
                    )}
                  </div>
                </div>
              </div>

              <div className="pairing-footer">
                {/* Match Time Scheduling */}
                <div className="schedule-section">
                  <label>Match Time:</label>
                  {editingTime[pairing._id] ? (
                    <div className="schedule-input-group">
                      <input
                        type="datetime-local"
                        defaultValue={
                          pairing.scheduledTime 
                            ? new Date(pairing.scheduledTime).toISOString().slice(0, 16)
                            : ''
                        }
                        onChange={(e) => {
                          setEditingTime({
                            ...editingTime,
                            [pairing._id]: e.target.value
                          });
                        }}
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleScheduleTime(pairing._id, editingTime[pairing._id])}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingTime({})}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditingTime({ [pairing._id]: true })}
                    >
                      {pairing.scheduledTime ? 'Edit Time' : 'Set Time'}
                    </button>
                  )}
                </div>

                {/* Result Selection */}
                {pairing.blackPlayer && (
                  <div className="result-section">
                    <label>Result:</label>
                    <select 
                      value={pairing.result}
                      onChange={(e) => handleResultChange(pairing._id, e.target.value)}
                      disabled={pairing.result !== 'pending'}
                    >
                      <option value="pending">Pending</option>
                      <option value="1-0">1-0 (White Wins)</option>
                      <option value="0.5-0.5">½-½ (Draw)</option>
                      <option value="0-1">0-1 (Black Wins)</option>
                      <option value="1-0F">1-0 (Black Forfeit)</option>
                      <option value="0-1F">0-1 (White Forfeit)</option>
                    </select>
                    {pairing.result !== 'pending' && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleResultChange(pairing._id, 'pending')}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PairingsView;
