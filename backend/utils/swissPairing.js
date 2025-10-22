const Player = require('../models/Player');
const Pairing = require('../models/Pairing');

/**
 * Swiss Pairing Algorithm
 * This algorithm pairs players based on:
 * 1. Similar point scores
 * 2. Players who haven't played each other
 * 3. Color balance (alternating white/black)
 */

class SwissPairing {
  /**
   * Generate pairings for a round
   * @param {string} tournamentId - Tournament ID
   * @param {number} roundNumber - Round number
   * @returns {Array} Array of pairings
   */
  static async generatePairings(tournamentId, roundNumber) {
    // Get all players sorted by points (desc), then rating (desc)
    const players = await Player.find({ tournament: tournamentId })
      .sort({ points: -1, rating: -1 })
      .lean();

    if (players.length === 0) {
      throw new Error('No players found for this tournament');
    }

    const pairings = [];
    const paired = new Set();
    let boardNumber = 1;

    // **ROUND 1 SPECIAL LOGIC**: Divide players into two halves by rating
    if (roundNumber === 1) {
      // Sort players by rating (descending)
      const sortedByRating = [...players].sort((a, b) => b.rating - a.rating);
      
      // Calculate midpoint
      const midpoint = Math.floor(sortedByRating.length / 2);
      
      // Split into top half and bottom half
      const topHalf = sortedByRating.slice(0, midpoint);
      const bottomHalf = sortedByRating.slice(midpoint);
      
      // Pair first with first, second with second, etc.
      for (let i = 0; i < topHalf.length; i++) {
        if (i < bottomHalf.length) {
          const player1 = topHalf[i];
          const player2 = bottomHalf[i];
          
          // Higher rated player gets white
          const { whitePlayer, blackPlayer } = player1.rating >= player2.rating
            ? { whitePlayer: player1, blackPlayer: player2 }
            : { whitePlayer: player2, blackPlayer: player1 };

          pairings.push({
            tournament: tournamentId,
            round: roundNumber,
            whitePlayer: whitePlayer._id,
            blackPlayer: blackPlayer._id,
            board: boardNumber++,
            result: 'pending'
          });

          paired.add(player1._id.toString());
          paired.add(player2._id.toString());
        }
      }
      
      // Handle bye if odd number of players
      if (sortedByRating.length % 2 === 1) {
        const byePlayer = sortedByRating[sortedByRating.length - 1];
        pairings.push({
          tournament: tournamentId,
          round: roundNumber,
          whitePlayer: byePlayer._id,
          blackPlayer: null,
          board: boardNumber++,
          result: '1-0' // Bye gets full point
        });
      }
      
      return pairings;
    }

    // **ROUND 2+ LOGIC**: Standard Swiss pairing by points
    // Group players by points
    const pointGroups = this.groupByPoints(players);

    // Process each point group
    for (const group of pointGroups) {
      const unpaired = group.filter(p => !paired.has(p._id.toString()));
      
      if (unpaired.length === 0) continue;

      // If odd number in group, move the lowest rated player down
      let floater = null;
      if (unpaired.length % 2 === 1) {
        floater = unpaired.pop();
      }

      // Pair within the group
      while (unpaired.length >= 2) {
        const player1 = unpaired.shift();
        let player2 = null;
        let player2Index = -1;

        // Find suitable opponent
        for (let i = 0; i < unpaired.length; i++) {
          const candidate = unpaired[i];
          
          // Check if they haven't played before
          if (!player1.opponents.some(opp => opp.toString() === candidate._id.toString())) {
            player2 = candidate;
            player2Index = i;
            break;
          }
        }

        // If no valid opponent found (everyone played), pair with next available
        if (!player2) {
          player2 = unpaired.shift();
        } else {
          unpaired.splice(player2Index, 1);
        }

        // Determine colors based on previous games
        const { whitePlayer, blackPlayer } = this.determineColors(player1, player2);

        pairings.push({
          tournament: tournamentId,
          round: roundNumber,
          whitePlayer: whitePlayer._id,
          blackPlayer: blackPlayer._id,
          board: boardNumber++,
          result: 'pending'
        });

        paired.add(player1._id.toString());
        paired.add(player2._id.toString());
      }

      // Handle floater for next group
      if (floater) {
        unpaired.push(floater);
      }
    }

    // Handle remaining unpaired player (bye)
    const allPairedIds = Array.from(paired);
    const byePlayer = players.find(p => !allPairedIds.includes(p._id.toString()));
    
    if (byePlayer) {
      pairings.push({
        tournament: tournamentId,
        round: roundNumber,
        whitePlayer: byePlayer._id,
        blackPlayer: null, // null indicates a bye
        board: boardNumber++,
        result: '1-0' // Bye gets full point
      });
    }

    return pairings;
  }

  /**
   * Group players by their point scores
   */
  static groupByPoints(players) {
    const groups = {};
    
    players.forEach(player => {
      const points = player.points;
      if (!groups[points]) {
        groups[points] = [];
      }
      groups[points].push(player);
    });

    // Return groups sorted by points (descending)
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map(points => groups[points]);
  }

  /**
   * Determine which player gets white and black
   * Based on color balance from previous rounds
   */
  static determineColors(player1, player2) {
    const p1Whites = player1.colors.filter(c => c === 'white').length;
    const p1Blacks = player1.colors.filter(c => c === 'black').length;
    const p2Whites = player2.colors.filter(c => c === 'white').length;
    const p2Blacks = player2.colors.filter(c => c === 'black').length;

    const p1Balance = p1Whites - p1Blacks;
    const p2Balance = p2Whites - p2Blacks;

    // Player with more black games gets white
    if (p1Balance < p2Balance) {
      return { whitePlayer: player1, blackPlayer: player2 };
    } else if (p2Balance < p1Balance) {
      return { whitePlayer: player2, blackPlayer: player1 };
    }

    // If equal, higher rated player gets white in first round
    if (player1.colors.length === 0) {
      return player1.rating >= player2.rating 
        ? { whitePlayer: player1, blackPlayer: player2 }
        : { whitePlayer: player2, blackPlayer: player1 };
    }

    // Otherwise alternate from last game
    const p1LastColor = player1.colors[player1.colors.length - 1];
    return p1LastColor === 'white'
      ? { whitePlayer: player2, blackPlayer: player1 }
      : { whitePlayer: player1, blackPlayer: player2 };
  }

  /**
   * Update player records after a pairing
   */
  static async updatePlayerRecords(pairing) {
    const whitePlayer = await Player.findById(pairing.whitePlayer);
    const blackPlayer = pairing.blackPlayer ? await Player.findById(pairing.blackPlayer) : null;

    if (!whitePlayer) return;

    whitePlayer.colors.push('white');
    if (blackPlayer) {
      whitePlayer.opponents.push(blackPlayer._id);
      blackPlayer.opponents.push(whitePlayer._id);
      blackPlayer.colors.push('black');
      await blackPlayer.save();
    }

    await whitePlayer.save();
  }

  /**
   * Update points after result is entered
   */
  static async updatePoints(pairingId, result) {
    const pairing = await Pairing.findById(pairingId);
    if (!pairing) throw new Error('Pairing not found');

    pairing.result = result;
    await pairing.save();

    const whitePlayer = await Player.findById(pairing.whitePlayer);
    const blackPlayer = pairing.blackPlayer ? await Player.findById(pairing.blackPlayer) : null;

    // Award points based on result
    if (result === '1-0' || result === '1-0F') {
      whitePlayer.points += 1;
    } else if (result === '0-1' || result === '0-1F') {
      if (blackPlayer) blackPlayer.points += 1;
    } else if (result === '0.5-0.5') {
      whitePlayer.points += 0.5;
      if (blackPlayer) blackPlayer.points += 0.5;
    }

    await whitePlayer.save();
    if (blackPlayer) await blackPlayer.save();

    return { whitePlayer, blackPlayer };
  }

  /**
   * Calculate Buchholz score (sum of opponents' scores)
   */
  static async calculateBuchholz(playerId) {
    const player = await Player.findById(playerId).populate('opponents');
    if (!player) return 0;

    const buchholz = player.opponents.reduce((sum, opp) => sum + opp.points, 0);
    player.buchholz = buchholz;
    await player.save();

    return buchholz;
  }
}

module.exports = SwissPairing;
