# 🌟 ImpactMatch

> **Connecting People with Purpose** - A modern platform that bridges the gap between passionate individuals, organizations, and meaningful social causes through intelligent matching and interactive discovery.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-47A248.svg)](https://www.mongodb.com/)

---

## 🎯 Overview

**ImpactMatch** is a comprehensive social impact platform that revolutionizes how people engage with causes they care about. Using an intuitive swipe-based interface, interactive mapping, and intelligent matching algorithms, we make it effortless to discover, connect with, and contribute to social initiatives that align with your values.

### ✨ Key Highlights

- 🎨 **Modern Design**: Vibrant glassmorphic UI with smooth Framer Motion animations
- 🗺️ **Location-Based Discovery**: Find 200+ causes near you with interactive Leaflet maps
- 🔄 **Smart Matching**: AI-powered TF-IDF algorithm matches causes to your interests
- 📊 **Impact Tracking**: Gamified system with points, badges, and analytics
- ✅ **Verified NGOs**: Transparent verification system for organizations
- 🛡️ **Secure Authentication**: JWT-based auth with role-based access control
- 👨‍💼 **Admin Dashboard**: Comprehensive management panel with real-time analytics

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 For Users
- **Swipe Matching**: Discover causes through an engaging Tinder-like interface with keyboard support
- **Interactive Map**: Visualize 200+ causes across 10 Indian cities with real-time filtering
- **Personalized Dashboard**: Track matches, contributions, and impact metrics with beautiful charts
- **Profile Management**: Create detailed profiles with city, interests, and preferences
- **Badge System**: Earn Bronze (50 pts), Silver (100 pts), and Gold (200 pts) badges
- **Impact Buddy Chat**: AI-powered chat assistant for finding causes
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile

### 🏢 For Organizations & NGOs
- **Cause Creation**: Post and manage social initiatives
- **Volunteer Matching**: Connect with interested individuals through smart algorithms
- **Verification System**: Get official verification badge with certificate upload
- **Category Management**: 10 categories (Environment, Health, Education, Animals, Sports, etc.)
- **Location Tagging**: Real coordinates for map display
- **Impact Analytics**: Track engagement, matches, and reach

### 👨‍💼 For Administrators
- **User Management**: Full CRUD operations for all user types
- **NGO Verification**: Review and approve organization credentials with certificate viewing
- **Cause Moderation**: Manage and curate all causes on the platform
- **Analytics Dashboard**: Real-time statistics (users, causes, matches, verifications)
- **Activity Logs**: Monitor platform activities with timestamps and user tracking
- **Search & Filter**: Advanced tools for efficient management
- **Data Export**: Export user and cause data for reporting

---

## 🛠️ Tech Stack

### Frontend (16 Packages)
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **React** | 18.2.0 | UI framework with hooks |
| ⚡ **Vite** | 4.4.5 | Fast build tool and dev server |
| 🎨 **TailwindCSS** | 3.3.3 | Utility-first CSS framework |
| 🌊 **Framer Motion** | 10.16.4 | Smooth animations (300-450ms transitions) |
| 🗺️ **React Leaflet** | 4.2.1 | Interactive maps with OpenStreetMap |
| 🎭 **Lucide React** | 0.263.1 | Beautiful icon system (500+ icons) |
| 📊 **Recharts** | 2.8.0 | Data visualization and charts |
| 🔔 **React Toastify** | 9.1.3 | Toast notifications |
| 🚀 **React Router** | 6.15.0 | Client-side routing |
| 📡 **Axios** | 1.5.0 | HTTP client for API calls |
| 🎴 **React Tinder Card** | 1.6.4 | Swipeable card interface |
| 🎯 **React Spring** | 9.7.3 | Spring-physics animations |

### Backend (9 Packages)
| Technology | Version | Purpose |
|------------|---------|---------|
| 🟢 **Node.js** | 16+ | JavaScript runtime |
| 🚂 **Express.js** | 4.18.2 | Web framework |
| 🍃 **MongoDB** | 5.x | NoSQL database |
| 📦 **Mongoose** | 7.5.0 | ODM for MongoDB |
| 🔐 **JWT** | 9.0.2 | Authentication tokens |
| 🔒 **bcrypt** | 5.1.1 | Password hashing |
| 📤 **Multer** | 1.4.5-lts.1 | File upload handling |
| 🌐 **CORS** | 2.8.5 | Cross-origin resource sharing |
| 🤖 **Natural** | 6.7.0 | TF-IDF text similarity matching |

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** v7+ (comes with Node.js)
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ImpactMatch.git
cd ImpactMatch

# 2. Backend Setup
cd impactmatch
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
node data/createDemoData.js  # Seed 200 causes
node data/createAdmin.js      # Create admin account
npm start                     # Runs on http://localhost:5173

# 3. Frontend Setup (new terminal)
cd ../client
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev                   # Runs on http://localhost:3000

# 4. Open http://localhost:3000 in your browser
```

### Detailed Installation

#### Backend Setup

```bash
cd impactmatch

# Install all 9 backend packages
npm install express mongoose cors dotenv bcrypt jsonwebtoken multer body-parser
npm install -D nodemon

# Configure environment
cp .env.example .env
```

Edit `impactmatch/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/impactmatch
JWT_SECRET=your_secure_random_secret_here_change_this
PORT=5173
```

```bash
# Seed database with demo data
node data/createDemoData.js  # Creates 200 causes across India
node data/createAdmin.js     # Creates admin account

# Start backend server
npm start
# Output: "✓ ImpactMatch server running on port 5173"
```

#### Frontend Setup

```bash
cd client

# Install all 16 frontend packages
npm install react react-dom react-router-dom axios framer-motion leaflet react-leaflet lucide-react recharts react-toastify react-spring react-tinder-card
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# Configure environment
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5173/api
```

```bash
# Start development server
npm run dev
# Output: "Local: http://localhost:3000"
```

For complete step-by-step instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

---

## 📖 Usage

### 1️⃣ Register an Account

Navigate to `http://localhost:3000/register` and choose:

- **Individual**: Personal volunteer account
  - Provide name, email, password, city, interests
  
- **Organization**: Company or group account
  - Same fields as individual
  
- **NGO**: Non-profit organization
  - Requires certificate upload (PDF, JPG, PNG)
  - Goes through admin verification process

### 2️⃣ Browse Causes

**Swipe View** (`/swipe`):
- Swipe right (→) to show interest (+10 points)
- Swipe left (←) to pass
- Use mouse drag or keyboard arrows
- Filter by category (10 options)
- Filter by city (10 Indian cities)
- See AI similarity scores

**Map View** (`/map`):
- Interactive OpenStreetMap with markers
- 200+ causes across India
- Click markers for cause details
- Filter by verification status
- Zoom and pan controls
- Verified causes show green pulsing markers

### 3️⃣ Track Your Impact

**Dashboard** (`/dashboard`):
- **Impact Score**: Animated progress bar with current score
- **Badges**: Bronze (50), Silver (100), Gold (200)
- **Joined Causes**: List of all your matched causes
- **Statistics Cards**: Total causes, matches, verified
- **Category Breakdown**: Pie chart of your interests
- **Recent Activity**: Timeline of your actions

### 4️⃣ Admin Panel (Admin Only)

Access at `/admin/login` with admin credentials:

- **Dashboard**: Overview with 4 stat cards (users, causes, verifications, logs)
- **User Management**: 
  - View all users with search and filter
  - Edit user details
  - Delete users
  - Role management
- **NGO Verification**:
  - Review pending NGO applications
  - View uploaded certificates
  - Approve or reject with comments
- **Cause Management**:
  - View all causes
  - Edit or delete causes
  - Monitor verification status
- **Activity Logs**:
  - Track all platform activities
  - Filter by user, action, date
  - Export logs

---

## 🔑 Demo Credentials

### Demo User Account
```
Email: vismay@example.com
Password: demo123
City: Bangalore
Score: 80 points
Badge: Bronze
```
**Access**: Swipe, Map, Dashboard, Profile

### Admin Account
```
Email: admin@impactmatch.com
Password: admin123
```
**Access**: Full admin dashboard, user management, NGO verification, activity logs

### Test the Platform
1. Login as demo user
2. Navigate to `/swipe` to see matched causes
3. Swipe right on causes you like (+10 points each)
4. Go to `/map` to see all 200 causes on the map
5. Check `/dashboard` to see your progress
6. Logout and login as admin to see the admin panel

---

## 📁 Project Structure

```
ImpactMatch/
│
├── 📂 client/                          # Frontend React Application
│   ├── 📂 src/
│   │   ├── 📂 components/              # Main UI Components (20+ files)
│   │   │   ├── LandingPage.jsx         # Homepage with hero and features
│   │   │   ├── Login.jsx               # User login
│   │   │   ├── Register.jsx            # Multi-type registration
│   │   │   ├── Dashboard.jsx           # User analytics dashboard
│   │   │   ├── SwipePage.jsx           # Swipe interface
│   │   │   ├── SwipeCard.jsx           # Individual cause card
│   │   │   ├── MapView.jsx             # Interactive Leaflet map
│   │   │   ├── Navbar.jsx              # Glassmorphic navbar with auto-hide
│   │   │   ├── ProgressBar.jsx         # Animated progress component
│   │   │   ├── BadgeDisplay.jsx        # Badge showcase
│   │   │   └── ...
│   │   ├── 📂 admin/                   # Admin Panel Components
│   │   │   ├── AdminDashboard.jsx      # Admin overview
│   │   │   ├── UserManagement.jsx      # CRUD for users
│   │   │   ├── NGOVerification.jsx     # NGO approval workflow
│   │   │   ├── ActivityLogs.jsx        # Activity monitoring
│   │   │   └── components/
│   │   │       ├── Sidebar.jsx         # Admin navigation
│   │   │       └── StatsCard.jsx       # Stat display component
│   │   ├── 📂 api/                     # API Integration Layer
│   │   │   ├── userAPI.js              # User endpoints
│   │   │   ├── matchAPI.js             # Match endpoints
│   │   │   └── verifyAPI.js            # Verification endpoints
│   │   ├── 📂 utils/                   # Utility Functions
│   │   │   └── formatters.js           # Date, number formatting
│   │   ├── App.jsx                     # Main app component
│   │   ├── main.jsx                    # Entry point
│   │   ├── index.css                   # Global styles
│   │   └── constants.js                # App constants
│   ├── public/                         # Static assets
│   ├── index.html                      # HTML template
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind configuration
│   └── postcss.config.cjs              # PostCSS configuration
│
├── 📂 impactmatch/                     # Backend Node.js Application
│   ├── 📂 models/                      # MongoDB Schemas
│   │   ├── User.js                     # User model with auth
│   │   ├── Cause.js                    # Cause model with geo data
│   │   ├── Match.js                    # Match relationship
│   │   ├── Verification.js             # Verification records
│   │   ├── NGODetails.js               # NGO-specific data
│   │   └── ActivityLog.js              # Admin activity tracking
│   ├── 📂 routes/                      # Express API Routes
│   │   ├── userRoutes.js               # /api/user/* (register, login, profile)
│   │   ├── matchRoutes.js              # /api/match/* (causes, swipe, matches)
│   │   ├── adminRoutes.js              # /api/admin/* (users, stats, logs)
│   │   ├── verifyRoutes.js             # /api/verify/* (NGO verification)
│   │   ├── dashboardRoutes.js          # /api/dashboard/* (analytics)
│   │   └── chatRoutes.js               # /api/chat/* (AI suggestions)
│   ├── 📂 utils/                       # Backend Utilities
│   │   ├── auth.js                     # JWT middleware
│   │   ├── upload.js                   # Multer file upload
│   │   ├── logger.js                   # Winston logging
│   │   ├── matcher.js                  # TF-IDF matching algorithm
│   │   ├── geolocation.js              # Coordinate utilities
│   │   └── blockchain.js               # (Future) Blockchain integration
│   ├── 📂 data/                        # Seed Scripts & Data
│   │   ├── createDemoData.js           # Seed 200 causes
│   │   ├── createAdmin.js              # Create admin account
│   │   ├── generateCauses.js           # Generate cause data
│   │   ├── causes.json                 # Cause templates
│   │   └── users.json                  # User templates
│   ├── 📂 config/
│   │   └── db.js                       # MongoDB connection
│   ├── 📂 uploads/                     # User-uploaded files (certificates)
│   ├── server.js                       # Express server entry point
│   ├── package.json                    # Backend dependencies
│   └── .env.example                    # Environment template
│
├── 📄 README.md                        # This file
├── 📄 SETUP_GUIDE.md                  # Detailed installation guide
├── 📄 QUICK_SETUP.md                  # Quick reference card
├── 📄 ADMIN_PANEL_README.md           # Admin panel documentation
├── 📄 ADMIN_PANEL_COMPLETE.md         # Admin implementation details
├── 📄 CLEANUP_COMPLETE.md             # Project cleanup summary
├── 📄 .gitignore                      # Git ignore rules
└── 📄 LICENSE                         # MIT License
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5173/api
```

### Authentication Endpoints

#### Register User
```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "city": "Bangalore",
  "interests": "environment,education",
  "accountType": "individual"
}

Response: { token, user }
```

#### Login
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Profile (Protected)
```http
GET /user/profile
Authorization: Bearer <token>

Response: { user }
```

### Match Endpoints

#### Get All Causes
```http
GET /match/causes
Response: { causes: [...] }
```

#### Get Matched Causes (AI-powered)
```http
POST /match
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user_id_here"
}

Response: { matches: [...] } // Top 10 causes with similarity scores
```

#### Record Swipe
```http
POST /match/swipe
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user_id",
  "causeId": "cause_id",
  "action": "like"
}

Response: { match, user } // +10 points on like
```

### Admin Endpoints (Protected)

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>

Response: { users: [...] }
```

#### Update User
```http
PUT /admin/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{ ...updated_fields }

Response: { user }
```

#### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>

Response: { message: "User deleted" }
```

#### Get Pending Verifications
```http
GET /admin/verifications
Authorization: Bearer <admin_token>

Response: { verifications: [...] }
```

#### Approve/Reject Verification
```http
PUT /admin/verify/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved" | "rejected",
  "comments": "Reason here"
}

Response: { verification }
```

#### Get Activity Logs
```http
GET /admin/logs
Authorization: Bearer <admin_token>

Response: { logs: [...] }
```

#### Get Platform Statistics
```http
GET /admin/stats
Authorization: Bearer <admin_token>

Response: {
  totalUsers, totalCauses, totalMatches, totalVerifications,
  recentUsers, recentCauses
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### User Flow
- [ ] Register as Individual
- [ ] Register as Organization
- [ ] Register as NGO (with certificate upload)
- [ ] Login with demo credentials
- [ ] Logout and re-login
- [ ] Update profile information

#### Core Features
- [ ] Swipe right on causes (+10 points)
- [ ] Swipe left on causes
- [ ] Use keyboard arrows for swiping
- [ ] Filter causes by category
- [ ] Filter causes by city
- [ ] View map with all 200 markers
- [ ] Click map markers to see cause details
- [ ] View dashboard with statistics
- [ ] Check badge progression (Bronze at 50)

#### Admin Features
- [ ] Login as admin
- [ ] View user management table
- [ ] Search and filter users
- [ ] Edit user details
- [ ] Delete a user
- [ ] View pending NGO verifications
- [ ] Approve/reject an NGO
- [ ] View activity logs
- [ ] Check platform statistics

#### Responsive Design
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Check navbar auto-hide on scroll
- [ ] Verify all animations are smooth

### Automated Testing (Coming Soon)

```bash
# Backend tests
cd impactmatch
npm test

# Frontend tests
cd client
npm test
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/ImpactMatch.git`
3. **Create a branch**: `git checkout -b feature/AmazingFeature`
4. **Make changes** and commit: `git commit -m 'Add AmazingFeature'`
5. **Push** to branch: `git push origin feature/AmazingFeature`
6. **Open a Pull Request** on GitHub

### Contribution Guidelines

- **Code Style**: Follow existing patterns (ESLint config included)
- **Commits**: Use clear, descriptive commit messages
- **Comments**: Add comments for complex logic
- **Documentation**: Update README/docs as needed
- **Testing**: Test thoroughly before submitting
- **Issues**: Check existing issues before creating new ones

### Development Tips

```bash
# Run frontend and backend together
npm run dev:all  # (if you set this up)

# Check for linting errors
cd client && npm run lint

# Format code
npm run format
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh
# Should connect without errors

# Check port 5173 is available
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173

# Restart MongoDB
# Windows: net start MongoDB
# Mac: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

### Frontend can't reach API
- Verify backend is running: `curl http://localhost:5173/health`
- Check `client/.env` has correct `VITE_API_URL`
- Check browser console for CORS errors
- Clear browser cache and restart dev server

### Map not loading
- Check browser console for errors
- Verify causes exist: Run `node impactmatch/data/createDemoData.js`
- Check MongoDB connection
- Ensure Leaflet CSS is imported in `main.jsx`

### File upload failing (NGO certificates)
- Check `impactmatch/uploads/` directory exists
- Verify file size < 5MB
- Check file type is PDF, JPG, or PNG
- Ensure multer middleware is configured

### Database errors
```bash
# Reset database (WARNING: Deletes all data)
mongosh impactmatch --eval "db.dropDatabase()"

# Re-seed
cd impactmatch
node data/createDemoData.js
node data/createAdmin.js
```

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 ImpactMatch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🌐 Links & Resources

- **Live Demo**: *Coming soon*
- **Documentation**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Admin Panel Guide**: [ADMIN_PANEL_README.md](ADMIN_PANEL_README.md)
- **Quick Setup**: [QUICK_SETUP.md](QUICK_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ImpactMatch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/ImpactMatch/discussions)

---

## 👥 Authors & Acknowledgments

### Authors
- **Vismay** - *Creator & Developer* - [GitHub Profile](https://github.com/YOUR_USERNAME)

### Acknowledgments
- **OpenStreetMap** - Map tiles and data
- **Lucide** - Beautiful icon system
- **MongoDB** - Robust database
- **React Community** - Excellent libraries
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- All contributors and users of ImpactMatch

---

## 📞 Contact & Support

### Get Help
- **GitHub Issues**: For bug reports and feature requests
- **Email**: *your-email@example.com*
- **Twitter**: *@YourHandle*
- **Discord**: *Coming soon*

### Quick Links
- [Report a Bug](https://github.com/YOUR_USERNAME/ImpactMatch/issues/new?labels=bug)
- [Request a Feature](https://github.com/YOUR_USERNAME/ImpactMatch/issues/new?labels=enhancement)
- [Join Discussion](https://github.com/YOUR_USERNAME/ImpactMatch/discussions)

---

## 📊 Project Stats

- **Total Files**: 83
- **Lines of Code**: ~25,000
- **Components**: 20+
- **API Endpoints**: 25+
- **Database Models**: 6
- **Demo Causes**: 200
- **Supported Cities**: 10
- **Categories**: 10
- **Development Time**: *Your timeline here*

---

## 🎯 Future Roadmap

### v2.0 (Planned)
- [ ] GPS check-in verification at cause locations
- [ ] QR code attendance scanning
- [ ] Mobile app (React Native)
- [ ] Push notifications for new causes
- [ ] Social sharing of verified impact
- [ ] Real-time leaderboard
- [ ] OpenAI embeddings for semantic matching

### v3.0 (Ideas)
- [ ] Video testimonials for causes
- [ ] In-app messaging between users and NGOs
- [ ] Payment integration for donations
- [ ] Volunteer hour tracking
- [ ] Integration with LinkedIn credentials
- [ ] Multi-language support
- [ ] Dark mode

---

<div align="center">

**Made with ❤️ for Social Impact**

⭐ **Star this repo if you find it helpful!** ⭐

[Report Bug](https://github.com/YOUR_USERNAME/ImpactMatch/issues) · [Request Feature](https://github.com/YOUR_USERNAME/ImpactMatch/issues) · [Documentation](SETUP_GUIDE.md)

</div>
