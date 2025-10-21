const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Player = require('../models/Player');
const Pairing = require('../models/Pairing');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ date: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tournament by share link
router.get('/share/:shareLink', async (req, res) => {
  try {
    const tournament = await Tournament.findOne({ shareLink: req.params.shareLink });
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new tournament
router.post('/', async (req, res) => {
  try {
    const tournament = new Tournament({
      name: req.body.name,
      date: req.body.date,
      totalRounds: req.body.totalRounds || 5
    });

    const newTournament = await tournament.save();
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update tournament
router.put('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (req.body.name) tournament.name = req.body.name;
    if (req.body.date) tournament.date = req.body.date;
    if (req.body.status) tournament.status = req.body.status;
    if (req.body.currentRound !== undefined) tournament.currentRound = req.body.currentRound;
    if (req.body.totalRounds) tournament.totalRounds = req.body.totalRounds;

    const updatedTournament = await tournament.save();
    res.json(updatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Delete all associated players and pairings
    await Player.deleteMany({ tournament: req.params.id });
    await Pairing.deleteMany({ tournament: req.params.id });
    await Tournament.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tournament standings
router.get('/:id/standings', async (req, res) => {
  try {
    const players = await Player.find({ tournament: req.params.id })
      .sort({ points: -1, buchholz: -1, rating: -1 });
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
