const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Player = require('../models/Player');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all players for a tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const players = await Player.find({ tournament: req.params.tournamentId })
      .sort({ rating: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a single player
router.post('/', async (req, res) => {
  try {
    const player = new Player({
      tournament: req.body.tournament,
      name: req.body.name,
      rating: req.body.rating,
      university: req.body.university
    });

    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk add players from Excel file
router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tournamentId = req.body.tournament;
    if (!tournamentId) {
      return res.status(400).json({ message: 'Tournament ID is required' });
    }

    // Parse Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate and create players
    const players = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Expected columns: Name, Rating, University (case-insensitive)
      const name = row.Name || row.name || row.NAME;
      const rating = row.Rating || row.rating || row.RATING;
      const university = row.University || row.university || row.UNIVERSITY;

      if (!name || !rating || !university) {
        errors.push(`Row ${i + 2}: Missing required fields (Name, Rating, University)`);
        continue;
      }

      if (isNaN(rating) || rating < 0) {
        errors.push(`Row ${i + 2}: Invalid rating value`);
        continue;
      }

      try {
        const player = new Player({
          tournament: tournamentId,
          name: name.toString().trim(),
          rating: parseInt(rating),
          university: university.toString().trim()
        });

        const savedPlayer = await player.save();
        players.push(savedPlayer);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.status(201).json({
      message: `Successfully added ${players.length} players`,
      players: players,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (req.body.name) player.name = req.body.name;
    if (req.body.rating !== undefined) player.rating = req.body.rating;
    if (req.body.university) player.university = req.body.university;
    if (req.body.points !== undefined) player.points = req.body.points;

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
