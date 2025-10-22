import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentAPI, pairingAPI } from '../../services/api';
import './UserView.css';

function UserView() {
  const { shareLink } = useParams();
  const [tournament, setTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('standings');

  const fetchTournamentData = useCallback(async () => {
    try {
      const tournamentResponse = await tournamentAPI.getByShareLink(shareLink);
      const tournamentData = tournamentResponse.data;
      setTournament(tournamentData);
      
      if (tournamentData.currentRound > 0) {
        setSelectedRound(tournamentData.currentRound);
      }

      const standingsResponse = await tournamentAPI.getStandings(tournamentData._id);
      setStandings(standingsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Tournament not found or link is invalid');
      setLoading(false);
    }
  }, [shareLink]);

  const fetchPairings = useCallback(async () => {
    if (!tournament) return;
    try {
      const response = await pairingAPI.getByTournamentAndRound(tournament._id, selectedRound);
      setPairings(response.data);
    } catch (err) {
      console.error('Failed to load pairings', err);
    }
  }, [tournament, selectedRound]);

  useEffect(() => {
    fetchTournamentData();
  }, [fetchTournamentData]);

  useEffect(() => {
    if (selectedRound && tournament) {
      fetchPairings();
    }
  }, [selectedRound, tournament, fetchPairings]);

  const getResultClass = (result) => {
    if (result === '1-0' || result === '1-0F') return 'result-white';
    if (result === '0-1' || result === '0-1F') return 'result-black';
    if (result === '0.5-0.5') return 'result-draw';
    return 'result-pending';
  };

  if (loading) {
    return <div className="loading">Loading tournament...</div>;
  }

  if (error || !tournament) {
    return (
      <div className="card text-center">
        <h2>❌ {error || 'Tournament not found'}</h2>
        <p>Please check the link and try again</p>
      </div>
    );
  }

  const rounds = Array.from({ length: tournament.currentRound }, (_, i) => i + 1);

  return (
    <div className="user-view">
      <div className="tournament-info card">
        <h1>🏆 {tournament.name}</h1>
        <div className="tournament-meta">
          <span>📅 {new Date(tournament.date).toLocaleDateString()}</span>
          <span className={`status-badge status-${tournament.status}`}>
            {tournament.status}
          </span>
          <span>🎯 Round {tournament.currentRound} / {tournament.totalRounds}</span>
        </div>
      </div>

      <div className="view-tabs">
        <button 
          className={`tab ${activeView === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveView('standings')}
        >
          📊 Standings
        </button>
        <button 
          className={`tab ${activeView === 'pairings' ? 'active' : ''}`}
          onClick={() => setActiveView('pairings')}
          disabled={tournament.currentRound === 0}
        >
          🤝 Pairings
        </button>
      </div>

      {activeView === 'standings' && (
        <div className="standings-section">
          <h2 className="section-title">Current Standings</h2>
          {standings.length === 0 ? (
            <div className="card text-center">
              <p>No players registered yet</p>
            </div>
          ) : (
            <div className="card">
              <div className="responsive-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Rating</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((player, index) => (
                      <tr key={player._id} className={index < 3 ? `rank-${index + 1}` : ''}>
                        <td>
                          <span className="rank-number">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && (index + 1)}
                          </span>
                        </td>
                        <td><strong>{player.name}</strong></td>
                        <td>{player.rating || 1200}</td>
                        <td className="points">{player.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'pairings' && (
        <div className="pairings-section">
          <div className="flex-between mb-20">
            <h2 className="section-title">Round Pairings</h2>
            {rounds.length > 0 && (
              <div className="round-selector">
                <label>Round: </label>
                <select 
                  value={selectedRound} 
                  onChange={(e) => setSelectedRound(parseInt(e.target.value))}
                >
                  {rounds.map(round => (
                    <option key={round} value={round}>Round {round}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {pairings.length === 0 ? (
            <div className="card text-center">
              <p>No pairings available for this round</p>
            </div>
          ) : (
            <div className="pairings-grid">
              {pairings.map((pairing) => (
                <div key={pairing._id} className="pairing-card card">
                  <div className="pairing-header">
                    <span className="board-number">Board {pairing.board}</span>
                    <span className={`result-badge ${getResultClass(pairing.result)}`}>
                      {pairing.result === 'pending' ? 'In Progress' : pairing.result}
                    </span>
                  </div>
                  
                  <div className="pairing-match">
                    <div className="player white">
                      <span className="color-icon">⚪</span>
                      <div className="player-details">
                        <strong>{pairing.whitePlayer?.name || 'Unknown'}</strong>
                        <span className="meta">
                          Rating: {pairing.whitePlayer?.rating || 1200}
                        </span>
                        <span className="score">Points: {pairing.whitePlayer?.points}</span>
                      </div>
                    </div>

                    <div className="vs-divider">VS</div>

                    <div className="player black">
                      <span className="color-icon">⚫</span>
                      <div className="player-details">
                        {pairing.blackPlayer ? (
                          <>
                            <strong>{pairing.blackPlayer.name}</strong>
                            <span className="meta">
                              Rating: {pairing.blackPlayer.rating || 1200}
                            </span>
                            <span className="score">Points: {pairing.blackPlayer.points}</span>
                          </>
                        ) : (
                          <strong className="bye">BYE</strong>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserView;
