const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    default: 1200
  },
  points: {
    type: Number,
    default: 0
  },
  opponents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  colors: [{
    type: String,
    enum: ['white', 'black']
  }],
  buchholz: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

playerSchema.index({ tournament: 1 });

module.exports = mongoose.model('Player', playerSchema);
