import React, { useState, useEffect } from 'react';
import { tournamentAPI } from '../../services/api';
import './StandingsView.css';

function StandingsView({ tournamentId }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStandings();
  }, [tournamentId]);

  const fetchStandings = async () => {
    try {
      const response = await tournamentAPI.getStandings(tournamentId);
      setStandings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load standings');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading standings...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (standings.length === 0) {
    return (
      <div className="card text-center">
        <h3>No standings yet</h3>
        <p>Add players to see standings</p>
      </div>
    );
  }

  return (
    <div className="standings-view">
      <h3 className="mb-20">Tournament Standings</h3>
      
      <div className="card">
        <table className="table standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>University</th>
              <th>Rating</th>
              <th>Points</th>
              <th>Buchholz</th>
              <th>Games</th>
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
                <td>{player.university}</td>
                <td>{player.rating}</td>
                <td className="points">{player.points}</td>
                <td>{player.buchholz.toFixed(1)}</td>
                <td>{player.opponents.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="standings-info card mt-20">
        <h4>Tiebreak Information</h4>
        <p><strong>Buchholz:</strong> Sum of opponents' scores. Higher is better for tiebreaks.</p>
        <p><strong>Sorting:</strong> Players are ranked by Points (highest first), then Buchholz, then Rating.</p>
      </div>
    </div>
  );
}

export default StandingsView;
