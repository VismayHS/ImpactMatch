# 🚀 ImpactMatch - Quick Setup Reference

## ⚡ Installation Commands

### Backend (impactmatch/)
```bash
cd impactmatch
npm install express mongoose cors dotenv bcrypt jsonwebtoken multer body-parser
npm install --save-dev nodemon
npm run seed:admin
npm run seed:demo
npm run dev
```

### Frontend (client/)
```bash
cd client
npm install react react-dom vite react-router-dom axios framer-motion leaflet react-leaflet lucide-react recharts react-toastify react-spring @vitejs/plugin-react tailwindcss autoprefixer postcss
npm run dev
```

---

## 📦 Package Lists

### Backend Dependencies (9 total)
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.21.1 | Web framework |
| mongoose | ^8.8.4 | MongoDB ODM |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.4.7 | Environment variables |
| bcrypt | ^5.1.1 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| multer | ^1.4.5-lts.1 | File upload |
| body-parser | ^1.20.3 | Request parsing |
| nodemon | ^3.1.9 | Dev auto-reload (dev) |

### Frontend Dependencies (16 total)
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React DOM renderer |
| vite | ^5.4.21 | Build tool (dev) |
| react-router-dom | ^6.28.0 | Routing |
| axios | ^1.7.9 | HTTP client |
| framer-motion | ^11.15.0 | Animations |
| leaflet | ^1.9.4 | Maps core |
| react-leaflet | ^4.2.1 | React maps wrapper |
| lucide-react | ^0.468.0 | Icons |
| recharts | ^2.15.0 | Charts |
| react-toastify | ^10.0.6 | Notifications |
| react-spring | ^9.7.4 | Spring animations |
| @vitejs/plugin-react | ^4.3.4 | Vite React plugin (dev) |
| tailwindcss | ^3.4.17 | CSS framework (dev) |
| autoprefixer | ^10.4.20 | CSS prefix (dev) |
| postcss | ^8.4.49 | CSS processor (dev) |

---

## 🔑 Login Credentials

### Demo User
```
Email: vismay@example.com
Password: demo123
Access: Main app (causes, map, swipe)
```

### Admin User
```
Email: admin@impactmatch.com
Password: admin123
Access: Admin panel (/admin/login)
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5173 |
| Admin Panel | http://localhost:3000/admin/login |
| Health Check | http://localhost:5173/health |

---

## 🗄️ MongoDB Configuration

### Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/impactmatch
```

### MongoDB Atlas (Cloud)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/impactmatch
```

---

## 📁 Files to Create

### Backend `.env` (impactmatch/.env)
```env
MONGO_URI=mongodb://localhost:27017/impactmatch
PORT=5173
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend Constants (client/src/constants.js)
```javascript
export const API_BASE_URL = 'http://localhost:5173';
```

---

## 🔄 Common Commands

### Backend
```bash
npm run dev          # Start dev server with auto-reload
npm start            # Start production server
npm run seed:admin   # Create admin user
npm run seed:demo    # Create demo data (user + causes)
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## ✅ Quick Verification

### 1. Check MongoDB
```bash
mongosh
# or
mongo
```

### 2. Check Backend
```bash
cd impactmatch
npm run dev
# Visit: http://localhost:5173/health
```

### 3. Check Frontend
```bash
cd client
npm run dev
# Visit: http://localhost:3000
```

### 4. Test Login
- Go to http://localhost:3000/login
- Use: vismay@example.com / demo123

### 5. Test Map
- Go to http://localhost:3000/map
- Should see 200 causes across Indian cities

### 6. Test Admin
- Go to http://localhost:3000/admin/login
- Use: admin@impactmatch.com / admin123

---

## 🐛 Quick Fixes

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9
```

### Missing Dependencies
```bash
# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

### Lucide-react Not Found
```bash
cd client
npm install lucide-react
```

---

## 📊 Database Collections (After Setup)

- **users** - User accounts (200+ documents)
- **ngodetails** - NGO certificates
- **activitylogs** - Activity tracking
- **causes** - Social causes (200 documents)
- **matches** - User-cause matches

---

## 🎯 Testing Checklist

- [ ] Backend starts on port 5173
- [ ] Frontend starts on port 3000
- [ ] MongoDB connected
- [ ] Demo user login works
- [ ] Admin login works
- [ ] Map shows 200 causes
- [ ] Registration works (Individual/Org/NGO)
- [ ] Swipe page loads causes
- [ ] Admin panel accessible

---

## 📞 Need Help?

### Check these first:
1. MongoDB running? → `mongosh`
2. .env file created? → Check `impactmatch/.env`
3. Dependencies installed? → Run `npm install` in both folders
4. Demo data seeded? → Run `npm run seed:demo`
5. Ports available? → 3000 and 5173 should be free

### Still stuck?
- Check logs in terminal for errors
- Verify MongoDB connection string
- Ensure all packages installed correctly
- Try clearing node_modules and reinstalling

---

**Last Updated:** October 30, 2025  
**Setup Time:** ~10 minutes  
**Total Dependencies:** Backend: 9 | Frontend: 16
