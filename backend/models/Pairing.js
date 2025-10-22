const mongoose = require('mongoose');

const pairingSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null // null means bye
  },
  result: {
    type: String,
    enum: ['1-0', '0-1', '0.5-0.5', 'pending', '1-0F', '0-1F'], // F for forfeit
    default: 'pending'
  },
  board: {
    type: Number,
    required: true
  },
  scheduledTime: {
    type: Date,
    default: null // Admin can set match timing
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

pairingSchema.index({ tournament: 1, round: 1 });

module.exports = mongoose.model('Pairing', pairingSchema);
