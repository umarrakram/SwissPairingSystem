# Swiss Pairing System for Chess Tournaments

A full-stack web application for managing chess tournaments using the Swiss pairing system. Built with React (frontend) and Node.js/Express (backend).

## Features

### Admin Features
- Create and manage tournaments
- Add players individually or bulk upload via Excel
- Generate Swiss system pairings automatically
- Record match results and track scores
- View real-time standings with tiebreak calculations
- Schedule match times for each pairing
- Share public viewing links

### User/Public Features
- View tournament standings
- View pairings for all rounds
- See match results and scheduled times

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** - File upload handling
- **XLSX** - Excel file parsing

### Frontend
- **React** 18
- **React Router** 6
- **Axios** - HTTP client

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/yourusername/SwissPairingSystem.git
cd SwissPairingSystem

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. **Configure environment variables:**

Create `backend/.env`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/swiss-pairing
NODE_ENV=development
```

For MongoDB Atlas, replace the URI with your connection string.

3. **Start the application:**
```bash
# Terminal 1 - Start backend (port 5001)
cd backend
npm run dev

# Terminal 2 - Start frontend (port 3000)
cd frontend
npm start
```

4. **Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`

### Admin Credentials
- **Username**: `AdminEjust`
- **Password**: `EJUSTChess2025`

## Usage

### Create Tournament
1. Login with admin credentials
2. Click "Create New Tournament"
3. Enter tournament name, date, and total rounds

### Add Players
- **Individual**: Click "Add Player" and enter details
- **Bulk Upload**: Use Excel file with columns: Name, Rating, University

### Generate Pairings
1. Go to "Pairings" tab
2. Click "Generate Round [N] Pairings"
3. Swiss pairing algorithm automatically pairs players

### Record Results
1. Select the round in "Pairings" tab
2. Choose result for each match (1-0, 0-1, ½-½, forfeit)
3. Points are updated automatically

### View Standings
1. Go to "Standings" tab
2. View ranked players sorted by points and tiebreaks

### Share Tournament
1. Copy the public viewing link from tournament header
2. Share with participants to view standings and pairings

## Deployment

The application can be deployed to Vercel:

```bash
# Use the deployment script
./deploy.sh
```

Or manually:
- Backend: Deploy to Vercel Serverless Functions
- Frontend: Deploy to Vercel Static Hosting
- Database: Use MongoDB Atlas

Configure environment variables in Vercel dashboard.

## License

MIT License

---

**E-JUST Chess Tournament System** | Made with ♟️
