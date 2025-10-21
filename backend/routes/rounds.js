const express = require('express');
const router = express.Router();
const Pairing = require('../models/Pairing');
const Player = require('../models/Player');
const SwissPairing = require('../utils/swissPairing');

// Get all rounds for a tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const pairings = await Pairing.find({ tournament: req.params.tournamentId })
      .populate('whitePlayer')
      .populate('blackPlayer')
      .sort({ round: 1, board: 1 });

    // Group by round
    const rounds = {};
    pairings.forEach(pairing => {
      if (!rounds[pairing.round]) {
        rounds[pairing.round] = [];
      }
      rounds[pairing.round].push(pairing);
    });

    res.json(rounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate tiebreaks (Buchholz) for all players in a tournament
router.post('/tournament/:tournamentId/calculate-tiebreaks', async (req, res) => {
  try {
    const players = await Player.find({ tournament: req.params.tournamentId });
    
    for (const player of players) {
      await SwissPairing.calculateBuchholz(player._id);
    }

    const updatedPlayers = await Player.find({ tournament: req.params.tournamentId })
      .sort({ points: -1, buchholz: -1, rating: -1 });

    res.json({
      message: 'Tiebreaks calculated successfully',
      players: updatedPlayers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
