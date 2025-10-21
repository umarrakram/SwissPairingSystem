# Sample Test Data for Swiss Pairing System

This file contains sample data you can use to quickly test the application.

## Sample Tournament

**Name:** University Chess Championship 2025
**Date:** 2025-11-15
**Total Rounds:** 5

## Sample Players (Copy this into Excel for bulk upload)

```csv
Name,Rating,University
Magnus Carlsen,2850,Norwegian University
Hikaru Nakamura,2780,Webster University
Fabiano Caruana,2800,Saint Louis University
Ding Liren,2790,Peking University
Ian Nepomniachtchi,2770,Moscow State University
Alireza Firouzja,2750,FIDE
Wesley So,2760,Webster University
Levon Aronian,2730,Saint Louis University
Anish Giri,2750,Amsterdam University
Maxime Vachier-Lagrave,2740,Sorbonne University
Shakhriyar Mamedyarov,2730,Azerbaijan State University
Teimour Radjabov,2720,Baku State University
Viswanathan Anand,2750,National Institute of India
Alexander Grischuk,2730,Moscow State University
Wang Hao,2740,Beijing Normal University
Sergey Karjakin,2730,Moscow Chess Academy
```

## Quick Test Workflow

### 1. Create Tournament
- Name: University Chess Championship 2025
- Date: Pick any future date
- Rounds: 5

### 2. Add Players
- Use bulk upload with the CSV data above
- Or add 8-16 players manually

### 3. Generate Round 1 Pairings
- Click "Generate Round 1 Pairings"
- Should pair highest rated vs lowest rated

### 4. Record Sample Results
Round 1 suggested results:
- Board 1: 1-0 (higher rated wins)
- Board 2: 0.5-0.5 (draw)
- Board 3: 0-1 (upset - lower rated wins)
- Board 4: 1-0 (higher rated wins)
- Continue with mixed results

### 5. Generate Round 2
- Click "Generate Round 2 Pairings"
- Should pair players with same points
- Players who already played won't be paired again

### 6. Test Standings
- Go to Standings tab
- Click "Calculate Tiebreaks"
- Verify sorting by points, then Buchholz

### 7. Test Public View
- Copy the share link
- Open in incognito/private window
- Verify standings and pairings are visible

## Test Cases

### Test Case 1: Odd Number of Players
- Add 9 or 11 players
- Generate pairings
- Verify one player gets a BYE
- Verify BYE player gets 1 point

### Test Case 2: Color Balance
- Play multiple rounds
- Check player records
- Verify players alternate colors when possible

### Test Case 3: Avoid Repeat Pairings
- Play 3+ rounds
- Verify same players don't play twice
- Check opponent tracking

### Test Case 4: Excel Upload Errors
Create an Excel file with errors:
```csv
Name,Rating,University
Valid Player,1800,MIT
Missing Rating,,Harvard
Invalid Rating,ABC,Yale
,1700,Princeton
```
- Upload this file
- Verify error reporting
- Verify valid rows are imported

### Test Case 5: Tournament Completion
- Complete all rounds
- Record all results
- Mark tournament as completed
- Verify no more pairings can be generated

## Sample Tournament Scenarios

### Scenario 1: Small Tournament (8 players)
- Easy to track all pairings
- All players play each other by round 7
- Good for understanding the algorithm

### Scenario 2: Medium Tournament (16 players)
- Typical university tournament size
- 4-5 rounds recommended
- Tests pairing complexity

### Scenario 3: Large Tournament (32+ players)
- Stress test for algorithm
- Multiple score groups form
- Tests performance

## Expected Behavior

### Round 1
- Players sorted by rating
- Top half plays bottom half
- Board 1: Highest vs Median
- Higher rated gets white (usually)

### Round 2+
- Players grouped by points
- 1-pointers play 1-pointers
- 0-pointers play 0-pointers
- Within groups, rating determines board order

### Color Assignment
- Alternates when possible
- Balances white/black count
- Considers previous games

### Tiebreaks
- Buchholz = sum of opponents' scores
- Player who beat stronger opponents has higher Buchholz
- Used to break ties in standings

## Performance Testing

### Quick Test (5 minutes)
1. Create tournament
2. Add 8 players (bulk upload)
3. Generate 2 rounds
4. Record results
5. Check standings

### Full Test (15 minutes)
1. Create tournament
2. Add 16 players
3. Generate 5 rounds with results
4. Calculate tiebreaks
5. Test public view
6. Complete tournament

### Stress Test (30 minutes)
1. Create multiple tournaments
2. Add 32+ players each
3. Generate all rounds
4. Test all features
5. Check performance

## API Testing with cURL

### Create Tournament
```bash
curl -X POST http://localhost:5000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tournament",
    "date": "2025-12-01",
    "totalRounds": 5
  }'
```

### Add Player
```bash
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "tournament": "TOURNAMENT_ID",
    "name": "Test Player",
    "rating": 1800,
    "university": "Test University"
  }'
```

### Generate Pairings
```bash
curl -X POST http://localhost:5000/api/pairings/generate \
  -H "Content-Type: application/json" \
  -d '{"tournamentId": "TOURNAMENT_ID"}'
```

### Get Standings
```bash
curl http://localhost:5000/api/tournaments/TOURNAMENT_ID/standings
```

## Common Issues to Test

1. **Empty Tournament**
   - Try generating pairings with no players
   - Should show error message

2. **Single Player**
   - Add only 1 player
   - Generate pairings
   - Should get BYE automatically

3. **Already Paired Round**
   - Try generating same round twice
   - Should show error

4. **Invalid Result**
   - Try recording invalid result
   - Should validate input

5. **Deleted Player**
   - Delete a player mid-tournament
   - Check for broken references

## MongoDB Queries for Testing

```javascript
// Count tournaments
db.tournaments.countDocuments()

// View all players in a tournament
db.players.find({ tournament: ObjectId("TOURNAMENT_ID") })

// View round pairings
db.pairings.find({ tournament: ObjectId("TOURNAMENT_ID"), round: 1 })

// Check player points
db.players.find({}, { name: 1, points: 1, rating: 1 }).sort({ points: -1 })

// Delete test data
db.tournaments.deleteMany({})
db.players.deleteMany({})
db.pairings.deleteMany({})
```

## Automated Testing Ideas

### Unit Tests
- Test Swiss pairing algorithm
- Test color determination
- Test point calculation
- Test Buchholz calculation

### Integration Tests
- Test full tournament workflow
- Test Excel upload
- Test API endpoints
- Test database operations

### E2E Tests
- Test user flows
- Test admin operations
- Test public view
- Test error handling

## Sample Excel File Content

Save this as `sample_players.csv` and import to Excel:

```
Name,Rating,University
Alice Johnson,1900,MIT
Bob Williams,1850,Stanford
Carol Davis,1820,Harvard
David Martinez,1790,Yale
Emily Brown,1770,Princeton
Frank Wilson,1750,Columbia
Grace Lee,1730,Cornell
Henry Taylor,1710,Brown
Iris Anderson,1690,Dartmouth
Jack Thomas,1670,Penn
```

Then save as .xlsx and upload!

---

Happy testing! ♟️
