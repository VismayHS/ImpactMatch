# 🚀 ImpactMatch - Quick Demo Guide

## ⚡ Pre-Demo Setup (2 minutes)

### 1. Start All Services
```powershell
# Terminal 1: Blockchain
cd blockchain
npx hardhat node

# Terminal 2: Backend  
cd impactmatch
node server.js

# Terminal 3: Frontend
cd client
npm run dev
```

### 2. Verify Everything is Running
- ✅ Hardhat: http://localhost:8545
- ✅ Backend: http://localhost:5173/health
- ✅ Frontend: http://localhost:3000

### 3. Ensure Data is Seeded
```powershell
cd impactmatch
node data/seedTestData.js
```

---

## 📋 Demo Accounts Cheat Sheet

### 👤 Users
- **vismay@example.com** / demo123 (80 pts, Bronze, 5 matches)
- **priya@example.com** / demo123 (150 pts, Silver, 5 verified)

### 🏢 NGOs
- **ngo@greennearth.org** / ngo123 (Verified)
- **ngo@hopefoundation.org** / ngo123 (Pending)

### 🛠️ Admin
- **admin@impactmatch.com** / admin123

---

## 🎬 10-Minute Demo Flow

1. **Landing Page** (30s)
   - Show features, scroll hero section

2. **User Login** (1m)
   - Login as vismay@example.com
   - Show dashboard with impact score

3. **Cause Discovery** (2m)
   - Go to Swipe Page
   - Swipe right on 2-3 causes
   - Show AI matching in action

4. **Map View** (1m)
   - Click "Map" tab
   - Show clustered markers
   - Click on a cause

5. **User Dashboard** (1m)
   - Show impact score: 80 pts
   - Show Bronze badge
   - List joined causes

6. **NGO Verification** (2m)
   - Logout, login as ngo@greennearth.org
   - Navigate to verifications
   - Verify one user
   - Show blockchain TX hash

7. **Admin Panel** (1.5m)
   - Logout, login as admin@impactmatch.com
   - Show platform stats
   - Browse users/causes
   - Demo NGO approval

8. **Blockchain Proof** (30s)
   - Show Hardhat terminal
   - Point to recent TX
   - Explain transparency

9. **Close** (30s)
   - Recap: AI + Blockchain + UX
   - Call to action

---

## 💡 Key Talking Points

### Problem
"Volunteers struggle to find causes they care about, and NGOs can't verify impact transparently."

### Solution
"AI-powered matching + blockchain-verified impact tracking."

### Features
- 🎯 Smart cause matching (TF-IDF)
- 📍 Location-based discovery  
- 🏆 Gamified impact scores
- 🔗 Blockchain verification
- 📊 Real-time dashboards

### Tech Stack
React + Node.js + MongoDB + Hardhat + Solidity

---

## ⚠️ Emergency Fixes

### Server Down?
```powershell
cd impactmatch
node server.js
```

### Login Not Working?
```powershell
cd impactmatch
node data/seedTestData.js
```

### Blockchain Error?
```powershell
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🎯 Demo Success Checklist

During demo, show:
- [ ] User registration/login
- [ ] AI cause matching (swipe)
- [ ] Map with causes
- [ ] Impact score and badges
- [ ] NGO verification
- [ ] Blockchain TX hash
- [ ] Admin dashboard
- [ ] At least 3 different user roles

---

## 🔥 Wow Factors

1. **Tinder-style UI** - Everyone gets it instantly
2. **Real blockchain TX** - Show the hash, prove it's real
3. **Live score updates** - Gamification hooks people
4. **Map visualization** - Makes impact tangible
5. **3-role system** - Shows platform complexity

---

## 📊 Metrics to Highlight

- 5 Users seeded
- 10 Causes across cities
- 10 Matches created
- 7 Blockchain verifications
- 100% test coverage on login

---

**Pro Tip:** Keep the demo under 12 minutes. Practice transitions between accounts!

**Backup Plan:** If live demo fails, have screenshots/video ready.

**Energy:** Start strong, maintain enthusiasm, end with impact!
