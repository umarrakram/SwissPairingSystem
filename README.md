# Swiss Pairing System for Chess Tournaments

A full-stack web application for managing chess tournaments using the Swiss pairing system. Built with React (frontend) and Node.js/Express (backend).

## Features

### Admin Features
- **Tournament Management**
  - Create new tournaments with name and date
  - Access existing tournaments from database
  - Track tournament status (upcoming, ongoing, completed)
  - Generate shareable public viewing links

- **Player Management**
  - Add players individually with name, rating, and university
  - Bulk upload players via Excel file
  - View and manage all registered players
  - Track player points after each round

- **Swiss Pairing System**
  - Automatic pairing generation based on Swiss system algorithm
  - Considerations: point scores, previous opponents, color balance
  - Support for bye rounds
  - Update match results (win/loss/draw/forfeit)

- **Standings & Rankings**
  - Real-time tournament standings
  - Tiebreak calculations (Buchholz system)
  - Sortable by points, tiebreaks, and rating

### User/Public Features
- **Public Viewing Link**
  - Share tournament link with participants
  - View current standings
  - View pairings for all rounds
  - See match results and scores

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Additional Libraries:**
  - `multer` - File upload handling
  - `xlsx` - Excel file parsing
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment configuration

### Frontend
- **React** 18
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Responsive styling

## Project Structure

```
SwissPairingSystem/
├── backend/
│   ├── models/
│   │   ├── Tournament.js
│   │   ├── Player.js
│   │   └── Pairing.js
│   ├── routes/
│   │   ├── tournaments.js
│   │   ├── players.js
│   │   ├── pairings.js
│   │   └── rounds.js
│   ├── utils/
│   │   └── swissPairing.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── TournamentView.js
│   │   │   │   ├── PlayerManagement.js
│   │   │   │   ├── PairingsView.js
│   │   │   │   └── StandingsView.js
│   │   │   └── User/
│   │   │       └── UserView.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swiss-pairing
NODE_ENV=development
```

4. Start MongoDB (if using local installation):
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### Creating a Tournament

1. Open the application at `http://localhost:3000`
2. Click "Create New Tournament"
3. Enter tournament name, date, and number of rounds
4. Click "Create Tournament"

### Adding Players

**Individual Addition:**
1. Navigate to the tournament
2. Go to "Players" tab
3. Click "Add Player"
4. Enter player details (name, rating, university)

**Bulk Upload:**
1. Go to "Players" tab
2. Click "Bulk Upload"
3. Select an Excel file with the following format:

| Name | Rating | University |
|------|--------|-----------|
| John Doe | 1800 | MIT |
| Jane Smith | 1650 | Stanford |

4. Click "Upload"

### Generating Pairings

1. Ensure players are added
2. Click "Generate Round 1 Pairings"
3. The system will automatically pair players using Swiss system
4. View pairings in the "Pairings" tab

### Recording Results

1. Go to "Pairings" tab
2. Select the round
3. For each pairing, select the result:
   - 1-0 (White wins)
   - 0-1 (Black wins)
   - ½-½ (Draw)
   - Forfeit options
4. Results automatically update player points

### Viewing Standings

1. Go to "Standings" tab
2. Click "Calculate Tiebreaks" to update Buchholz scores
3. View ranked players with points and tiebreaks

### Sharing with Users

1. Copy the "Public View Link" from tournament header
2. Share with participants
3. Users can view standings and pairings without admin access

## Swiss Pairing Algorithm

The system implements the Swiss pairing algorithm with the following rules:

1. **Point Groups**: Players are grouped by their current point totals
2. **Pairing Within Groups**: Players are paired within their point group
3. **Previous Opponents**: Players who have already played each other are avoided
4. **Color Balance**: The system alternates colors and balances white/black assignments
5. **Floaters**: Odd players in a group move to the next lower group
6. **Bye Rounds**: If odd number of players, lowest-rated unpaired player gets a bye (1 point)

### Tiebreaks

The system uses the **Buchholz** tiebreak system:
- Sum of all opponents' scores
- Higher Buchholz indicates stronger opposition
- Used when players have equal points

## API Endpoints

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `GET /api/tournaments/share/:shareLink` - Get by share link
- `POST /api/tournaments` - Create tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament
- `GET /api/tournaments/:id/standings` - Get standings

### Players
- `GET /api/players/tournament/:tournamentId` - Get tournament players
- `POST /api/players` - Add single player
- `POST /api/players/bulk-upload` - Bulk upload from Excel
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Pairings
- `GET /api/pairings/tournament/:tournamentId/round/:roundNumber` - Get round pairings
- `POST /api/pairings/generate` - Generate next round
- `PUT /api/pairings/:id/result` - Update result

### Rounds
- `GET /api/rounds/tournament/:tournamentId` - Get all rounds
- `POST /api/rounds/tournament/:tournamentId/calculate-tiebreaks` - Calculate tiebreaks

## Excel Template Format

For bulk player upload, use this format:

```
| Name          | Rating | University |
|---------------|--------|-----------|
| Alice Johnson | 1900   | Harvard   |
| Bob Williams  | 1750   | Yale      |
| Carol Davis   | 1820   | Princeton |
```

- Column names are case-insensitive
- All three columns are required
- Rating must be a number

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build:prod
```

The build folder will contain optimized production files.

**Backend:**
```bash
cd backend
npm run prod
```

Configure production environment variables and deploy to your hosting service.

## Deployment

### Quick Deployment with Script

Use the included deployment script for easy setup:

```bash
./deploy.sh
```

Select from the menu:
1. **Development (Local)** - Start both frontend and backend locally
2. **Production (Vercel - Backend)** - Deploy backend to Vercel
3. **Production (Vercel - Frontend)** - Deploy frontend to Vercel
4. **Production (Vercel - Both)** - Deploy both services
5. **Test Build (Local)** - Build production version locally

### Deployment Guides

- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete guide for deploying to Vercel
- **[DEV_VS_PROD.md](./DEV_VS_PROD.md)** - Understanding development vs production configurations
- **[ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md)** - Quick reference for environment variables

### Environment Variables

**Development:**
- Backend uses `.env.development`
- Frontend uses `.env.development`
- Local MongoDB and proxy configuration

**Production:**
- Backend uses Vercel environment variables
- Frontend uses Vercel environment variables
- MongoDB Atlas and direct API URLs

See [DEV_VS_PROD.md](./DEV_VS_PROD.md) for detailed configuration.

## Database Schema

### Tournament
- name (String)
- date (Date)
- currentRound (Number)
- totalRounds (Number)
- status (String: upcoming/ongoing/completed)
- shareLink (String, unique)

### Player
- tournament (ObjectId ref Tournament)
- name (String)
- rating (Number)
- university (String)
- points (Number)
- opponents (Array of ObjectId)
- colors (Array of Strings)
- buchholz (Number)

### Pairing
- tournament (ObjectId ref Tournament)
- round (Number)
- whitePlayer (ObjectId ref Player)
- blackPlayer (ObjectId ref Player, nullable for bye)
- result (String)
- board (Number)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

### CORS Issues
- Backend includes CORS middleware
- Check proxy setting in frontend `package.json`

### Port Conflicts
- Change PORT in backend `.env`
- Update proxy in frontend if needed

## Future Enhancements

- [ ] User authentication for admins
- [ ] Email notifications for pairings
- [ ] Print-friendly pairing sheets
- [ ] Support for team tournaments
- [ ] Historical tournament archives
- [ ] Player profiles and statistics
- [ ] Live game clock integration
- [ ] Mobile app version

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for your tournaments!

## Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoints

## Acknowledgments

- Swiss pairing algorithm based on FIDE regulations
- Chess community for feedback and testing

---

Made with ♟️ for chess tournament organizers
