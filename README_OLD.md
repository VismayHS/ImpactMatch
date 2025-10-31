# ImpactMatch 🎯

> **Swipe Right for Social Good** - An AI-powered platform that matches volunteers with local causes using TF-IDF algorithms and records verified impact on blockchain.

---

## 🚀 Quick Start (5 Steps)

### Prerequisites
- Node.js 18+ 
- MongoDB running locally
- Git

### Installation

```bash
# 1. Install dependencies for all components
cd impactmatch && npm install
cd ../blockchain && npm install  
cd ../client && npm install
cd ..

# 2. Start MongoDB (if not already running)
# macOS/Linux: sudo systemctl start mongodb
# Windows: net start MongoDB

# 3. Run the demo script
bash scripts/demo.sh
# OR run each service manually (see Manual Setup below)

# 4. Open browser to http://localhost:5173

# 5. Login with demo credentials:
#    Email: vismay@example.com | Password: demo123
```

---

## 📋 2-Minute Demo Script

Follow this exact flow to showcase all features:

1. **Onboarding** (30 seconds)
   - Open http://localhost:5173
   - Click "Get Started"
   - Enter name, email, password
   - Select city: Bangalore
   - Add interests: environment, education, health
   - Click through 3-step form with smooth animations

2. **Swipe & Match** (30 seconds)
   - See AI-matched causes with similarity scores
   - Swipe right on "Tree Plantation Drive" 
   - Toast notification: "+10 points!" 
   - Swipe 2-3 more causes
   - Try keyboard arrows (← →) for accessibility

3. **Dashboard Analytics** (30 seconds)
   - Click "Dashboard" in navbar
   - View impact score with animated progress bar
   - See badge earned (BRONZE at 50 pts)
   - Check pie chart showing category breakdown
   - View joined causes list

4. **Blockchain Verification** (30 seconds)
   - Click "Verify" in navbar
   - See pending verification list
   - Click "Verify" button on a cause
   - Watch confetti animation 🎉
   - Modal shows blockchain txHash
   - Score increases by +20 points

5. **Map Visualization** (30 seconds)
   - Click "Map" in navbar
   - See verified causes with pulsing green markers
   - See joined causes with blue markers
   - Click markers to view cause details
   - OpenStreetMap integration

**Bonus**: Try Impact Buddy chat on swipe page - ask "find health causes in Mumbai"

---

## 🛠️ Manual Setup (Alternative to demo.sh)

### Terminal 1: Start Hardhat Blockchain
```bash
cd blockchain
npx hardhat node
# Keep this running - you'll see accounts and transactions
```

### Terminal 2: Deploy Smart Contract
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address shown
```

### Terminal 3: Seed Database & Start Backend
```bash
cd impactmatch

# Generate 200 causes with coordinates
node data/generateCauses.js

# Seed MongoDB with demo data
node data/seed.js

# Start backend server
node server.js
# Should show "✓ ImpactMatch server running on port 3000"
```

### Terminal 4: Start Frontend
```bash
cd client
npm run dev
# Open http://localhost:5173
```

---

## 🏗️ Architecture

```
ImpactMatch/
├── client/              # React frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/  # 10 React components
│   │   ├── api/         # API helper functions
│   │   └── utils/       # Formatters, constants
│   └── package.json
├── impactmatch/         # Node.js backend
│   ├── models/          # MongoDB schemas (User, Cause, Match, Verification)
│   ├── routes/          # API endpoints
│   ├── utils/           # TF-IDF matcher, blockchain, geolocation
│   ├── data/            # Causes JSON & seed scripts
│   └── server.js
├── blockchain/          # Hardhat + Solidity
│   ├── contracts/       # ProofOfImpact.sol
│   ├── scripts/         # Deployment scripts
│   └── hardhat.config.js
└── scripts/             # Demo startup scripts
```

---

## 🎨 Key Features

### 1. AI-Powered Matching (TF-IDF)
- Uses `natural` library for text similarity scoring
- Matches user interests with cause descriptions
- Considers city proximity (nearby cities fallback)
- Returns top 10 matches with similarity percentages

### 2. Gamification System
- **+10 points** for joining a cause (swipe right)
- **+20 points** for blockchain verification
- **Badges**: Bronze (50), Silver (100), Gold (200)
- Animated progress bars and confetti celebrations

### 3. Blockchain Proof of Impact
- Ethereum smart contract (Solidity 0.8.19)
- Records immutable verification records
- Emits `ImpactRecorded` events with volunteer address, causeId, hash
- Real transaction hashes displayed to users

### 4. Interactive UI/UX
- Swipeable cards (react-tinder-card) with drag gestures
- Framer Motion animations (300ms transitions)
- Keyboard accessibility (arrow keys)
- TailwindCSS custom theme (primary: #16A34A green)

### 5. Map Visualization
- React-Leaflet + OpenStreetMap integration
- Verified causes: pulsing green markers (1.4s animation)
- Joined causes: blue markers
- Real Indian city coordinates

---

## 🔧 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, react-tinder-card, React-Leaflet, Recharts |
| **Backend** | Node.js, Express, Mongoose (MongoDB), natural (TF-IDF), ethers.js |
| **Database** | MongoDB (Users, Causes, Matches, Verifications) |
| **Blockchain** | Hardhat, Solidity 0.8.19, ethers.js |
| **Animation** | Framer Motion (card swipes 450ms, transitions 300ms) |
| **Maps** | Leaflet, OpenStreetMap tiles |

---

## 📡 API Endpoints

### Users
- `POST /api/users/register` - Create account
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

### Matching
- `POST /api/match` - Get AI-matched causes
- `POST /api/match/join` - Join a cause (+10 pts)

### Dashboard
- `GET /api/dashboard?userId=<id>` - Get analytics
- `GET /api/dashboard/map?userId=<id>` - Get map data

### Verification
- `GET /api/verify/pending?userId=<id>` - Get pending verifications
- `POST /api/verify` - Verify match (+20 pts, blockchain record)

### Chat
- `POST /api/chat/suggest` - Get AI suggestions from query

---

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  city: String,
  interests: String (comma-separated),
  impactScore: Number (default: 0),
  badges: [String],
  joinedCauses: [ObjectId ref Match]
}
```

### Cause
```javascript
{
  name: String,
  description: String,
  category: String,
  city: String,
  lat: Number,
  lng: Number
}
```

### Match
```javascript
{
  userId: ObjectId ref User,
  causeId: ObjectId ref Cause,
  status: enum ['interested', 'verified'],
  verifiedAt: Date,
  txHash: String
}
```

### Verification
```javascript
{
  matchId: ObjectId ref Match,
  verifierId: ObjectId ref User,
  txHash: String (required),
  blockchainEventData: Object
}
```

---

## 🎯 Demo Data

### 4 Demo Users (Password: demo123)

| Email | City | Score | Badge | Verified | Pending |
|-------|------|-------|-------|----------|---------|
| vismay@example.com | Bangalore | 80 | BRONZE | 3 | 4 |
| priya@example.com | Mumbai | 150 | SILVER | 5 | 5 |
| amit@example.com | Delhi | 230 | GOLD | 8 | 3 |
| sneha@example.com | Hyderabad | 40 | - | 1 | 3 |

### 200 Causes Across 10 Categories

**Categories**: environment, health, education, animals, sports, women empowerment, technology, volunteering, children, youth

**Cities**: Bangalore, Mumbai, Delhi, Chennai, Pune, Kolkata, Hyderabad, Jaipur, Lucknow, Surat

Each cause has real lat/lng coordinates with slight random offsets for map variety.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh
# Should connect without errors

# Check port 3000 is free
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

### Frontend can't reach API
- Check `client/vite.config.js` proxy points to `http://localhost:3000`
- Verify backend is running: `curl http://localhost:3000/health`
- Check browser console for CORS errors

### Blockchain verification fails
- Ensure Hardhat node is running on port 8545
- Check contract is deployed: look for `blockchain/deployment.json`
- Verify contract address in `impactmatch/utils/blockchain.js`
- Redeploy if needed: `cd blockchain && npx hardhat run scripts/deploy.js --network localhost`

### No causes showing on map
- Run seed script: `cd impactmatch && node data/seed.js`
- Check MongoDB has data: `mongosh impactmatch --eval "db.causes.count()"`
- Should return 200

---

## 🚀 Future Enhancements

### Planned Features
- [ ] GPS check-in verification at cause locations
- [ ] QR code attendance scanning
- [ ] OpenAI embeddings for semantic matching (currently using TF-IDF)
- [ ] Mobile app (React Native)
- [ ] Push notifications for new matched causes
- [ ] Social sharing of verified impact
- [ ] NGO dashboard for posting causes
- [ ] Real-time leaderboard
- [ ] Integration with LinkedIn for verified credentials

### Code Placeholders
- `blockchain.js` has commented function `matchWithEmbeddings()` for future OpenAI integration
- Frontend components have `aria-label` attributes for screen reader support
- All buttons support keyboard focus rings (accessibility-ready)

---

## 📊 Performance Notes

- **TF-IDF Matching**: ~50ms for 200 causes
- **Blockchain Recording**: ~2-3 seconds (local Hardhat node)
- **Map Rendering**: Lazy loads only user's causes
- **Animation Budget**: All transitions under 500ms for smooth UX

---

## 🔐 Environment Variables

Create `.env` files in respective directories:

### impactmatch/.env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/impactmatch
BLOCKCHAIN_RPC=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEMO_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### client/.env
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📄 License

MIT License - Built for hackathon demo purposes

---

## 👥 Credits

**AI Matching**: Uses `natural` library's TF-IDF implementation  
**Blockchain**: Ethereum Hardhat framework  
**UI Components**: TailwindCSS, Framer Motion, React-Leaflet  
**Map Data**: OpenStreetMap contributors  

---

## 📞 Support

For demo issues or questions, check:
1. `logs/` directory for error logs
2. MongoDB connection: `mongosh`
3. Hardhat console output in Terminal 1
4. Browser console (F12) for frontend errors

**Quick Health Check**:
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173

# Hardhat
curl -X POST http://localhost:8545 -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

Built with ❤️ for social impact | Demo-ready in 5 minutes ⚡
