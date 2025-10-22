const express = require('express');
const router = express.Router();
const Pairing = require('../models/Pairing');
const Tournament = require('../models/Tournament');
const SwissPairing = require('../utils/swissPairing');

// Get all pairings for a tournament and round
router.get('/tournament/:tournamentId/round/:roundNumber', async (req, res) => {
  try {
    const pairings = await Pairing.find({
      tournament: req.params.tournamentId,
      round: parseInt(req.params.roundNumber)
    })
      .populate('whitePlayer')
      .populate('blackPlayer')
      .sort({ board: 1 });

    res.json(pairings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pairings for a tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const pairings = await Pairing.find({ tournament: req.params.tournamentId })
      .populate('whitePlayer')
      .populate('blackPlayer')
      .sort({ round: 1, board: 1 });

    res.json(pairings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate pairings for next round
router.post('/generate', async (req, res) => {
  try {
    const { tournamentId } = req.body;
    
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const nextRound = tournament.currentRound + 1;

    if (nextRound > tournament.totalRounds) {
      return res.status(400).json({ message: 'Tournament has reached maximum rounds' });
    }

    // Check if pairings already exist for this round
    const existingPairings = await Pairing.find({
      tournament: tournamentId,
      round: nextRound
    });

    if (existingPairings.length > 0) {
      return res.status(400).json({ message: 'Pairings already exist for this round' });
    }

    // Generate pairings
    const pairingsData = await SwissPairing.generatePairings(tournamentId, nextRound);

    // Save pairings to database
    const savedPairings = await Pairing.insertMany(pairingsData);

    // Update player records
    for (const pairing of savedPairings) {
      await SwissPairing.updatePlayerRecords(pairing);
    }

    // Update tournament current round
    tournament.currentRound = nextRound;
    if (tournament.status === 'upcoming') {
      tournament.status = 'ongoing';
    }
    await tournament.save();

    // Populate and return
    const populatedPairings = await Pairing.find({ _id: { $in: savedPairings.map(p => p._id) } })
      .populate('whitePlayer')
      .populate('blackPlayer')
      .sort({ board: 1 });

    res.status(201).json({
      message: `Round ${nextRound} pairings generated successfully`,
      round: nextRound,
      pairings: populatedPairings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update pairing result
router.put('/:id/result', async (req, res) => {
  try {
    const { result } = req.body;
    
    if (!['1-0', '0-1', '0.5-0.5', '1-0F', '0-1F'].includes(result)) {
      return res.status(400).json({ message: 'Invalid result' });
    }

    const updatedPlayers = await SwissPairing.updatePoints(req.params.id, result);
    
    const pairing = await Pairing.findById(req.params.id)
      .populate('whitePlayer')
      .populate('blackPlayer');

    res.json({
      message: 'Result updated successfully',
      pairing: pairing,
      updatedPlayers: updatedPlayers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update scheduled time for a match
router.put('/:id/schedule', async (req, res) => {
  try {
    const { scheduledTime } = req.body;
    
    const pairing = await Pairing.findById(req.params.id);
    
    if (!pairing) {
      return res.status(404).json({ message: 'Pairing not found' });
    }

    pairing.scheduledTime = scheduledTime ? new Date(scheduledTime) : null;
    await pairing.save();

    const updatedPairing = await Pairing.findById(req.params.id)
      .populate('whitePlayer')
      .populate('blackPlayer');

    res.json({
      message: 'Match time updated successfully',
      pairing: updatedPairing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pairing by ID
router.get('/:id', async (req, res) => {
  try {
    const pairing = await Pairing.findById(req.params.id)
      .populate('whitePlayer')
      .populate('blackPlayer');
    
    if (!pairing) {
      return res.status(404).json({ message: 'Pairing not found' });
    }

    res.json(pairing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
