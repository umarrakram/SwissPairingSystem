# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Swiss Pairing System                             │
│                     Chess Tournament Management                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                             │
│                         http://localhost:3000                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        Admin Interface                           │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  ┌──────────────────┐  ┌────────────────┐  ┌────────────────┐  │    │
│  │  │ AdminDashboard   │  │ TournamentView │  │ PlayerMgmt     │  │    │
│  │  │ - List Tourns    │  │ - Overview     │  │ - Add Player   │  │    │
│  │  │ - Create New     │  │ - Tabs         │  │ - Bulk Upload  │  │    │
│  │  │ - Delete         │  │ - Share Link   │  │ - Delete       │  │    │
│  │  └──────────────────┘  └────────────────┘  └────────────────┘  │    │
│  │                                                                  │    │
│  │  ┌──────────────────┐  ┌────────────────┐  ┌────────────────┐  │    │
│  │  │ PairingsView     │  │ StandingsView  │  │ API Service    │  │    │
│  │  │ - View Pairings  │  │ - Rankings     │  │ - Axios calls  │  │    │
│  │  │ - Record Results │  │ - Points       │  │ - Error Handle │  │    │
│  │  │ - Round Select   │  │ - Tiebreaks    │  │                │  │    │
│  │  └──────────────────┘  └────────────────┘  └────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Public/User Interface                       │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │ UserView                                                 │   │    │
│  │  │ - Beautiful Header                                       │   │    │
│  │  │ - Standings Tab (Public)                                │   │    │
│  │  │ - Pairings Tab (Public)                                 │   │    │
│  │  │ - Responsive Design                                     │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└────────────────────────────┬──────────────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │ Axios Requests
                             │
┌────────────────────────────▼──────────────────────────────────────────────┐
│                          BACKEND (Node.js/Express)                         │
│                         http://localhost:5000/api                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                           API Routes                                 │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │                                                                      │  │
│  │  /api/tournaments          /api/players           /api/pairings     │  │
│  │  ├─ GET    /               ├─ GET    /tournament/:id                │  │
│  │  ├─ GET    /:id            ├─ POST   /              ├─ POST /generate│ │
│  │  ├─ GET    /share/:link    ├─ POST   /bulk-upload  ├─ PUT  /:id/result││
│  │  ├─ POST   /               ├─ PUT    /:id          ├─ GET  /tournament/│
│  │  ├─ PUT    /:id            ├─ DELETE /:id          │       :id/round/:n││
│  │  ├─ DELETE /:id            └─────────────────────  └──────────────────│ │
│  │  └─ GET    /:id/standings                                            │  │
│  │                                                                       │  │
│  │  /api/rounds                                                          │  │
│  │  ├─ GET    /tournament/:id                                           │  │
│  │  └─ POST   /tournament/:id/calculate-tiebreaks                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Swiss Pairing Algorithm                       │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │  ┌──────────────────────────────────────────────────────────────┐   │  │
│  │  │ SwissPairing Utility (utils/swissPairing.js)               │   │  │
│  │  ├──────────────────────────────────────────────────────────────┤   │  │
│  │  │ • generatePairings(tournamentId, roundNumber)               │   │  │
│  │  │   - Sort players by points & rating                         │   │  │
│  │  │   - Group by points                                         │   │  │
│  │  │   - Pair within groups                                      │   │  │
│  │  │   - Avoid repeat opponents                                  │   │  │
│  │  │   - Balance colors                                          │   │  │
│  │  │   - Handle byes                                             │   │  │
│  │  │                                                              │   │  │
│  │  │ • determineColors(player1, player2)                        │   │  │
│  │  │   - Check color history                                     │   │  │
│  │  │   - Balance white/black                                     │   │  │
│  │  │                                                              │   │  │
│  │  │ • updatePoints(pairingId, result)                          │   │  │
│  │  │   - Award points (1, 0.5, or 0)                            │   │  │
│  │  │   - Update player records                                   │   │  │
│  │  │                                                              │   │  │
│  │  │ • calculateBuchholz(playerId)                              │   │  │
│  │  │   - Sum opponents' scores                                   │   │  │
│  │  │   - Store tiebreak value                                    │   │  │
│  │  └──────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                          File Processing                              │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │  • Multer - File upload handling                                     │  │
│  │  • XLSX - Excel file parsing                                         │  │
│  │  • Validates columns: Name, Rating, University                       │  │
│  │  • Error reporting per row                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             │
┌────────────────────────────▼────────────────────────────────────────────────┐
│                         DATABASE (MongoDB)                                  │
│                   mongodb://localhost:27017/swiss-pairing                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Tournament Collection                                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ {                                                                    │   │
│  │   _id: ObjectId,                                                     │   │
│  │   name: String,                                                      │   │
│  │   date: Date,                                                        │   │
│  │   currentRound: Number,                                              │   │
│  │   totalRounds: Number,                                               │   │
│  │   status: String (upcoming/ongoing/completed),                       │   │
│  │   shareLink: String (unique),                                        │   │
│  │   createdAt: Date                                                    │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Player Collection                                                    │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ {                                                                    │   │
│  │   _id: ObjectId,                                                     │   │
│  │   tournament: ObjectId (ref: Tournament),                            │   │
│  │   name: String,                                                      │   │
│  │   rating: Number,                                                    │   │
│  │   university: String,                                                │   │
│  │   points: Number,                                                    │   │
│  │   opponents: [ObjectId] (refs: Player),                              │   │
│  │   colors: [String] (white/black history),                            │   │
│  │   buchholz: Number,                                                  │   │
│  │   createdAt: Date                                                    │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Pairing Collection                                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ {                                                                    │   │
│  │   _id: ObjectId,                                                     │   │
│  │   tournament: ObjectId (ref: Tournament),                            │   │
│  │   round: Number,                                                     │   │
│  │   whitePlayer: ObjectId (ref: Player),                               │   │
│  │   blackPlayer: ObjectId (ref: Player, nullable for bye),             │   │
│  │   result: String (1-0/0-1/0.5-0.5/pending/1-0F/0-1F),               │   │
│  │   board: Number,                                                     │   │
│  │   createdAt: Date                                                    │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Flow Example                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. Admin Creates Tournament
   Frontend → POST /api/tournaments → Backend → MongoDB
   └─ Tournament document created with shareLink

2. Admin Adds Players (Bulk)
   Frontend → Upload Excel → POST /api/players/bulk-upload
   → Multer processes file → XLSX parses data → Validates
   → Creates Player documents → Returns success/errors

3. Admin Generates Pairings
   Frontend → POST /api/pairings/generate
   → SwissPairing.generatePairings()
      → Fetch players sorted by points & rating
      → Group by points
      → Pair within groups (avoid repeats)
      → Determine colors
      → Create Pairing documents
      → Update player opponents & colors
   → Returns pairings to Frontend

4. Admin Records Result
   Frontend → PUT /api/pairings/:id/result
   → SwissPairing.updatePoints()
      → Update pairing result
      → Award points to players
      → Save player documents
   → Returns updated data

5. User Views Tournament
   Frontend → GET /api/tournaments/share/:link
   → Fetch tournament by shareLink
   → GET /api/tournaments/:id/standings
   → Returns standings to Frontend
   → Display public view


┌─────────────────────────────────────────────────────────────────────────────┐
│                          Technology Stack                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Frontend:
├─ React 18
├─ React Router v6
├─ Axios
└─ CSS3

Backend:
├─ Node.js
├─ Express.js
├─ Mongoose
├─ Multer
├─ XLSX
├─ CORS
└─ Dotenv

Database:
└─ MongoDB

Development:
├─ Nodemon (backend auto-reload)
└─ React Scripts (CRA)


┌─────────────────────────────────────────────────────────────────────────────┐
│                         Key Features Flow                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Swiss Pairing Logic:
1. Sort players by points (descending) → rating (descending)
2. Group players by point totals
3. For each group:
   - Pair highest with next unpaired
   - Check if they played before (opponents array)
   - If yes, try next player
   - Determine colors (white/black balance)
   - Create pairing
4. Handle odd player (bye = 1 point, blackPlayer = null)
5. Update player records (opponents, colors)

Color Determination:
1. Count white games - black games for each player
2. Player with more blacks gets white
3. If equal, alternate from last game
4. First round: higher rated gets white

Tiebreak (Buchholz):
1. For each player, get opponents array
2. Sum all opponents' points
3. Higher Buchholz = stronger opposition
4. Used to break ties in standings

Result Points:
- 1-0 or 1-0F: White gets 1.0, Black gets 0.0
- 0-1 or 0-1F: White gets 0.0, Black gets 1.0
- 0.5-0.5: Both get 0.5
- BYE: Player gets 1.0 automatically
