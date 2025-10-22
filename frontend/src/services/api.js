import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Tournament APIs
export const tournamentAPI = {
  getAll: () => axios.get(`${API_URL}/tournaments`),
  getById: (id) => axios.get(`${API_URL}/tournaments/${id}`),
  getByShareLink: (shareLink) => axios.get(`${API_URL}/tournaments/share/${shareLink}`),
  create: (data) => axios.post(`${API_URL}/tournaments`, data),
  update: (id, data) => axios.put(`${API_URL}/tournaments/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/tournaments/${id}`),
  getStandings: (id) => axios.get(`${API_URL}/tournaments/${id}/standings`)
};

// Player APIs
export const playerAPI = {
  getByTournament: (tournamentId) => axios.get(`${API_URL}/players/tournament/${tournamentId}`),
  getById: (id) => axios.get(`${API_URL}/players/${id}`),
  create: (data) => axios.post(`${API_URL}/players`, data),
  bulkUpload: (tournamentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tournament', tournamentId);
    return axios.post(`${API_URL}/players/bulk-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => axios.put(`${API_URL}/players/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/players/${id}`)
};

// Pairing APIs
export const pairingAPI = {
  getByTournamentAndRound: (tournamentId, round) => 
    axios.get(`${API_URL}/pairings/tournament/${tournamentId}/round/${round}`),
  getByTournament: (tournamentId) => axios.get(`${API_URL}/pairings/tournament/${tournamentId}`),
  generate: (tournamentId) => axios.post(`${API_URL}/pairings/generate`, { tournamentId }),
  updateResult: (id, result) => axios.put(`${API_URL}/pairings/${id}/result`, { result }),
  getById: (id) => axios.get(`${API_URL}/pairings/${id}`)
};

// Round APIs
export const roundAPI = {
  getByTournament: (tournamentId) => axios.get(`${API_URL}/rounds/tournament/${tournamentId}`),
  calculateTiebreaks: (tournamentId) => 
    axios.post(`${API_URL}/rounds/tournament/${tournamentId}/calculate-tiebreaks`)
};
