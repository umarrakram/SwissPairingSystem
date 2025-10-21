const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  currentRound: {
    type: Number,
    default: 0
  },
  totalRounds: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  shareLink: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate share link before saving
tournamentSchema.pre('save', function(next) {
  if (!this.shareLink) {
    this.shareLink = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);
