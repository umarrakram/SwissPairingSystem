import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tournamentAPI, playerAPI, pairingAPI, roundAPI } from '../../services/api';
import PlayerManagement from './PlayerManagement';
import PairingsView from './PairingsView';
import StandingsView from './StandingsView';
import './TournamentView.css';

function TournamentView() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('players');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const fetchTournament = async () => {
    try {
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tournament');
      setLoading(false);
    }
  };

  const handleGeneratePairings = async () => {
    setError('');
    setSuccess('');

    if (!window.confirm(`Generate pairings for Round ${tournament.currentRound + 1}?`)) {
      return;
    }

    try {
      const response = await pairingAPI.generate(id);
      setSuccess(response.data.message);
      fetchTournament();
      setActiveTab('pairings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate pairings');
    }
  };

  const handleCalculateTiebreaks = async () => {
    try {
      await roundAPI.calculateTiebreaks(id);
      setSuccess('Tiebreaks calculated successfully');
      if (activeTab === 'standings') {
        // Refresh standings
        window.location.reload();
      }
    } catch (err) {
      setError('Failed to calculate tiebreaks');
    }
  };

  const handleStartTournament = async () => {
    try {
      await tournamentAPI.update(id, { status: 'ongoing' });
      setSuccess('Tournament started!');
      fetchTournament();
    } catch (err) {
      setError('Failed to start tournament');
    }
  };

  const handleCompleteTournament = async () => {
    if (!window.confirm('Are you sure you want to mark this tournament as completed?')) {
      return;
    }

    try {
      await tournamentAPI.update(id, { status: 'completed' });
      setSuccess('Tournament marked as completed!');
      fetchTournament();
    } catch (err) {
      setError('Failed to complete tournament');
    }
  };

  if (loading) {
    return <div className="loading">Loading tournament...</div>;
  }

  if (!tournament) {
    return <div className="card">Tournament not found</div>;
  }

  const shareLink = `${window.location.origin}/view/${tournament.shareLink}`;

  return (
    <div className="tournament-view">
      <div className="tournament-header card">
        <div className="flex-between">
          <div>
            <Link to="/" className="back-link">← Back to Dashboard</Link>
            <h2>{tournament.name}</h2>
            <p>
              <strong>Date:</strong> {new Date(tournament.date).toLocaleDateString()} | 
              <strong> Status:</strong> <span className={`status-badge status-${tournament.status}`}>
                {tournament.status}
              </span> | 
              <strong> Round:</strong> {tournament.currentRound} / {tournament.totalRounds}
            </p>
          </div>
          <div className="header-actions">
            {tournament.status === 'upcoming' && (
              <button className="btn btn-success" onClick={handleStartTournament}>
                Start Tournament
              </button>
            )}
            {tournament.status === 'ongoing' && (
              <>
                <button className="btn btn-primary" onClick={handleGeneratePairings}>
                  Generate Round {tournament.currentRound + 1} Pairings
                </button>
                <button className="btn btn-secondary" onClick={handleCalculateTiebreaks}>
                  Calculate Tiebreaks
                </button>
                {tournament.currentRound === tournament.totalRounds && (
                  <button className="btn btn-success" onClick={handleCompleteTournament}>
                    Complete Tournament
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="share-info">
          <strong>Public View Link:</strong>
          <div className="share-link-box">
            <code>{shareLink}</code>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                alert('Link copied to clipboard!');
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
        <button 
          className={`tab ${activeTab === 'pairings' ? 'active' : ''}`}
          onClick={() => setActiveTab('pairings')}
        >
          Pairings
        </button>
        <button 
          className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'players' && <PlayerManagement tournamentId={id} />}
        {activeTab === 'pairings' && <PairingsView tournamentId={id} tournament={tournament} />}
        {activeTab === 'standings' && <StandingsView tournamentId={id} />}
      </div>
    </div>
  );
}

export default TournamentView;
