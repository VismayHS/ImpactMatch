# 📦 ImpactMatch - Complete Setup Guide

## 🎯 Project Overview
ImpactMatch is a social impact platform that connects volunteers with meaningful causes. This guide provides complete setup instructions for both backend and frontend.

---

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v16.0.0 or higher (recommended: v18+)
- **npm**: v8.0.0 or higher (comes with Node.js)
- **MongoDB**: v5.0 or higher (running locally or MongoDB Atlas)
- **Git**: Latest version

### Verify Installation
```bash
node --version
npm --version
mongo --version  # or mongod --version
```

---

## 🗂️ Project Structure

```
ImpactMatch/
├── impactmatch/          # Backend (Node.js + Express + MongoDB)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── utils/            # Helper utilities
│   ├── data/             # Seed scripts
│   └── server.js         # Main server file
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── admin/        # Admin panel
│   │   └── App.jsx       # Main app component
│   └── package.json
├── uploads/              # User uploaded files
└── .gitignore
```

---

## 🚀 Backend Setup (impactmatch/)

### 1. Navigate to Backend Directory
```bash
cd impactmatch
```

### 2. Install Required Dependencies

#### Core Dependencies
```bash
npm install express@^4.21.1
npm install mongoose@^8.8.4
npm install cors@^2.8.5
npm install dotenv@^16.4.7
```

#### Security & Authentication
```bash
npm install bcrypt@^5.1.1
npm install jsonwebtoken@^9.0.2
```

#### File Upload
```bash
npm install multer@^1.4.5-lts.1
```

#### Middleware & Utilities
```bash
npm install body-parser@^1.20.3
```

#### Development Dependencies
```bash
npm install --save-dev nodemon@^3.1.9
```

### 3. Complete Backend package.json

Your `impactmatch/package.json` should include:

```json
{
  "name": "impactmatch-backend",
  "version": "1.0.0",
  "description": "ImpactMatch Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed:admin": "node data/createAdmin.js",
    "seed:demo": "node data/createDemoData.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.8.4",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

### 4. Environment Configuration

Create `.env` file in `impactmatch/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/impactmatch

# Server Configuration
PORT=5173

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development
```

### 5. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
3. Verify connection:
   ```bash
   mongo --eval "db.version()"
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` with Atlas URI:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/impactmatch
   ```

### 6. Initialize Demo Data

```bash
# Create admin user (admin@impactmatch.com / admin123)
npm run seed:admin

# Create demo user and sample causes (vismay@example.com / demo123)
npm run seed:demo
```

### 7. Start Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

**Server will run on:** http://localhost:5173

**Test API:** http://localhost:5173/health

---

## 🎨 Frontend Setup (client/)

### 1. Navigate to Frontend Directory
```bash
cd client
```

### 2. Install Required Dependencies

#### Core React & Build Tools
```bash
npm install react@^18.3.1
npm install react-dom@^18.3.1
npm install vite@^5.4.21
```

#### Routing
```bash
npm install react-router-dom@^6.28.0
```

#### HTTP Client
```bash
npm install axios@^1.7.9
```

#### UI & Styling
```bash
npm install tailwindcss@^3.4.17
npm install autoprefixer@^10.4.20
npm install postcss@^8.4.49
npm install framer-motion@^11.15.0
```

#### Icons
```bash
npm install lucide-react@^0.468.0
```

#### Maps
```bash
npm install leaflet@^1.9.4
npm install react-leaflet@^4.2.1
```

#### Charts & Data Visualization
```bash
npm install recharts@^2.15.0
```

#### Notifications
```bash
npm install react-toastify@^10.0.6
```

#### Additional UI Libraries
```bash
npm install react-spring@^9.7.4
npm install @react-spring/web@^9.7.4
```

#### Development Dependencies
```bash
npm install --save-dev @vitejs/plugin-react@^4.3.4
npm install --save-dev eslint@^9.16.0
```

### 3. Complete Frontend package.json

Your `client/package.json` should include:

```json
{
  "name": "impactmatch-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "axios": "^1.7.9",
    "framer-motion": "^11.15.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^6.28.0",
    "react-spring": "^9.7.4",
    "react-toastify": "^10.0.6",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.16.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^5.4.21"
  }
}
```

### 4. Vite Configuration

Ensure `client/vite.config.js` exists:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      }
    }
  }
})
```

### 5. TailwindCSS Configuration

Ensure `client/tailwind.config.js` exists:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          500: '#00C6A7',
        },
        blue: {
          500: '#007CF0',
        },
        violet: {
          500: '#8E2DE2',
        }
      }
    },
  },
  plugins: [],
}
```

### 6. API Configuration

Ensure `client/src/constants.js` exists:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';
```

### 7. Start Frontend Development Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend will run on:** http://localhost:3000

---

## 🔐 Default Credentials

### Demo User (Regular User)
- **Email:** vismay@example.com
- **Password:** demo123
- **Access:** Can view causes, swipe, and use map

### Admin User (Admin Panel)
- **Email:** admin@impactmatch.com
- **Password:** admin123
- **Access:** Full admin panel access at /admin/login

---

## 🚀 Quick Start (Both Servers)

### Terminal 1: Backend
```bash
cd impactmatch
npm install
npm run seed:admin
npm run seed:demo
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

### Access Application
- **Main App:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login
- **API Docs:** http://localhost:5173/health

---

## 📦 Complete Installation Script

### Windows (PowerShell)
```powershell
# Install Backend
cd impactmatch
npm install express mongoose cors dotenv bcrypt jsonwebtoken multer body-parser
npm install --save-dev nodemon

# Install Frontend
cd ..\client
npm install react react-dom vite react-router-dom axios framer-motion leaflet react-leaflet lucide-react recharts react-toastify react-spring
npm install --save-dev @vitejs/plugin-react tailwindcss autoprefixer postcss eslint

# Initialize Data
cd ..\impactmatch
npm run seed:admin
npm run seed:demo
```

### macOS/Linux (Bash)
```bash
# Install Backend
cd impactmatch
npm install express mongoose cors dotenv bcrypt jsonwebtoken multer body-parser
npm install --save-dev nodemon

# Install Frontend
cd ../client
npm install react react-dom vite react-router-dom axios framer-motion leaflet react-leaflet lucide-react recharts react-toastify react-spring
npm install --save-dev @vitejs/plugin-react tailwindcss autoprefixer postcss eslint

# Initialize Data
cd ../impactmatch
npm run seed:admin
npm run seed:demo
```

---

## 🔍 Verification Checklist

### Backend ✅
- [ ] MongoDB running (check with `mongo` or `mongosh`)
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env` file configured
- [ ] Admin user created (run `npm run seed:admin`)
- [ ] Demo data created (run `npm run seed:demo`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] API responds at http://localhost:5173/health

### Frontend ✅
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Vite config exists
- [ ] Tailwind config exists
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Application loads at http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Can access admin panel with admin credentials

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Windows: Start MongoDB service
net start MongoDB

# macOS/Linux: Start MongoDB daemon
sudo systemctl start mongod
```

#### Port 5173 Already in Use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9
```

#### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001,  // Use different port
}
```

#### Module Not Found (lucide-react, etc.)
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Vite Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 Database Collections

After setup, MongoDB will have these collections:

- **users** - User accounts (demo user, admin, etc.)
- **ngodetails** - NGO certificate information
- **activitylogs** - System activity tracking
- **causes** - Social impact causes (200 sample causes)
- **matches** - User-cause matching data (future)

---

## 🎯 Testing the Application

### 1. Test User Registration
1. Go to http://localhost:3000/register
2. Try all three types: Individual, Organization, NGO
3. For NGO, upload a PDF/JPEG certificate

### 2. Test Demo Login
1. Go to http://localhost:3000/login
2. Login with: vismay@example.com / demo123
3. Verify redirect to swipe page

### 3. Test Map View
1. Navigate to http://localhost:3000/map
2. Should see 200+ causes across Indian cities
3. Click markers to see cause details

### 4. Test Admin Panel
1. Go to http://localhost:3000/admin/login
2. Login with: admin@impactmatch.com / admin123
3. Test dashboard, user management, NGO verification, activity logs

---

## 🚢 Production Deployment

### Backend (Node.js)
- Use environment variables for sensitive data
- Enable CORS for specific origins only
- Use HTTPS
- Set up process manager (PM2)
- Configure MongoDB Atlas for cloud database

### Frontend (React)
- Build with `npm run build`
- Deploy to Vercel, Netlify, or AWS S3
- Set up environment variables
- Configure domain and SSL

---

## 📞 Support

### Common Commands
```bash
# Backend
npm run dev           # Start development server
npm run seed:admin    # Create admin user
npm run seed:demo     # Create demo data
npm start             # Production server

# Frontend
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
```

### Useful Links
- MongoDB Docs: https://docs.mongodb.com
- Express.js: https://expressjs.com
- React: https://react.dev
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com

---

## ✅ Package Summary

### Backend (8 packages + 1 dev)
```
express@^4.21.1
mongoose@^8.8.4
cors@^2.8.5
dotenv@^16.4.7
bcrypt@^5.1.1
jsonwebtoken@^9.0.2
multer@^1.4.5-lts.1
body-parser@^1.20.3

[dev] nodemon@^3.1.9
```

### Frontend (11 packages + 5 dev)
```
react@^18.3.1
react-dom@^18.3.1
react-router-dom@^6.28.0
axios@^1.7.9
framer-motion@^11.15.0
leaflet@^1.9.4
react-leaflet@^4.2.1
lucide-react@^0.468.0
recharts@^2.15.0
react-toastify@^10.0.6
react-spring@^9.7.4

[dev] vite@^5.4.21
[dev] @vitejs/plugin-react@^4.3.4
[dev] tailwindcss@^3.4.17
[dev] autoprefixer@^10.4.20
[dev] postcss@^8.4.49
```

---

**Built with ❤️ for ImpactMatch - Making Social Impact Accessible!**

Last Updated: October 30, 2025
