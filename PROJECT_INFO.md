# 📘 ImpactMatch - Project Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- MongoDB (running locally or Atlas)
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/VismayHS/ImpactMatch.git
cd ImpactMatch
```

2. **Start Both Servers**

**Option A: Using Scripts (Recommended)**
```bash
# Windows PowerShell
.\start-servers.ps1

# Windows Command Prompt
start-servers.bat
```

**Option B: Manual Start**
```bash
# Terminal 1 - Backend
cd impactmatch
npm install
npm start
# Server runs on http://localhost:5173

# Terminal 2 - Frontend
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5173/api
- Health Check: http://localhost:5173/health

---

## 🏗️ Project Structure

```
ImpactMatch/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboards/
│   │   │   │   ├── ngo/           # NGO Dashboard (6 pages)
│   │   │   │   ├── user/          # User Dashboard (6 pages)
│   │   │   │   └── admin/         # Admin Dashboard (7 pages)
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ... (other components)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── impactmatch/           # Express Backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication, etc.
│   ├── server.js
│   └── package.json
└── uploads/               # User-uploaded files
```

---

## 🎯 Dashboard System

### User Dashboard (`/user-dashboard`)
1. **Discover** - Tinder-style swipe interface for causes
2. **My Causes** - Track joined causes
3. **Impact Score** - Badge system with gamification
4. **Analytics** - Personal impact charts
5. **Blockchain Proofs** - Verification records
6. **Share Impact** - Social media sharing

### NGO Dashboard (`/ngo-dashboard`)
1. **Overview** - Platform stats and map
2. **Add Cause** - Create new causes
3. **Manage Causes** - Edit/delete causes
4. **Volunteer Requests** - Approve volunteers
5. **Verification History** - Blockchain records
6. **Analytics** - NGO performance metrics

### Admin Dashboard (`/admin-dashboard`)
1. **Overview** - Platform-wide statistics
2. **NGO Management** - Approve/reject NGOs with certificates
3. **User Management** - Suspend/activate users
4. **Cause Management** - Flag/remove causes
5. **Blockchain Tracker** - All verifications
6. **Anomaly Detection** - AI-powered monitoring
7. **Export Reports** - PDF generation

---

## 🔐 Authentication & Roles

### User Roles
- **user** - Regular volunteers
- **organisation** - NGOs creating causes
- **admin** - Platform administrators

### Login Flow
1. Go to `/login`
2. Enter email/password
3. System checks role and redirects:
   - Admin → `/admin-dashboard`
   - NGO → `/ngo-dashboard`
   - User → `/user-dashboard`

---

## 🐛 Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Kill processes if needed
taskkill /PID <process_id> /F
```

#### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `impactmatch/server.js`
- Default: `mongodb://localhost:27017/impactmatch`

#### "Cannot find module" Error
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Certificate Upload Not Working
- Check uploads folder exists: `mkdir uploads/certificates`
- Verify multer configuration in backend
- File size limit: 5MB
- Allowed formats: PDF, PNG, JPG

#### Admin Dashboard Shows No NGOs
- NGO role in database is `'organisation'` not `'ngo'`
- Check user collection: `db.users.find({role: 'organisation'})`

---

## 📝 Git Workflow

### Commit Messages
```bash
git add .
git commit -m "feat: Add new feature"
git commit -m "fix: Fix bug description"
git commit -m "docs: Update documentation"
git push origin main
```

### Recent Major Updates
- ✅ All 19 dashboard pages completed
- ✅ Removed duplicate admin system
- ✅ Fixed NGO certificate viewing
- ✅ Added PDF report generation
- ✅ Implemented AI anomaly detection

---

## 🧪 Testing

### Manual Testing Checklist

#### User Flow
- [ ] Register new user
- [ ] Login with user credentials
- [ ] Swipe through causes
- [ ] Join a cause
- [ ] View impact score
- [ ] Check blockchain proofs

#### NGO Flow
- [ ] Register as NGO with certificate
- [ ] Wait for admin approval
- [ ] Create a new cause
- [ ] View volunteer requests
- [ ] Verify volunteer contributions

#### Admin Flow
- [ ] Login as admin
- [ ] Approve pending NGO
- [ ] View certificate PDF
- [ ] Suspend user
- [ ] Generate PDF reports
- [ ] Check anomaly detection

---

## 🔧 Configuration

### Environment Variables
Create `.env` file in `impactmatch/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/impactmatch
JWT_SECRET=your_jwt_secret_key_here
PORT=5173
```

### Frontend API Base URL
Set in `client/src/` files:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/organisation/admin),
  city: String,
  interests: [String],
  verified: Boolean,
  certificatePath: String (for NGOs),
  createdAt: Date
}
```

### Causes Collection
```javascript
{
  title: String,
  description: String,
  ngoId: ObjectId (ref: Users),
  city: String,
  category: String,
  status: String (active/pending/flagged),
  image: String,
  createdAt: Date
}
```

### Matches Collection
```javascript
{
  userId: ObjectId (ref: Users),
  causeId: ObjectId (ref: Causes),
  status: String (joined/pending),
  joinDate: Date
}
```

### Verifications Collection
```javascript
{
  userId: ObjectId (ref: Users),
  causeId: ObjectId (ref: Causes),
  blockchainHash: String (SHA-256),
  timestamp: Date
}
```

---

## 🎨 UI/UX Features

### Design System
- **Colors**: Gradient themes (blue/purple/pink)
- **Effects**: Glassmorphism with backdrop-blur
- **Animations**: Framer Motion transitions
- **Icons**: Lucide React icon library
- **Charts**: Recharts library
- **Maps**: React Leaflet

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd impactmatch
# Add Procfile: web: node server.js
git push heroku main
```

### Environment Setup
- Set MongoDB Atlas connection string
- Configure CORS for production domain
- Update API_BASE_URL in frontend

---

## 📈 Performance

### Optimization Tips
- Images compressed to < 100KB
- Lazy loading for dashboard components
- Debounced search inputs
- Pagination for large lists
- MongoDB indexes on userId, causeId

---

## 🆘 Support

### Common Questions

**Q: How do I create an admin user?**
A: Manually update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Q: Certificate PDF won't open**
A: Ensure file path is correct and file exists in `uploads/certificates/`

**Q: Swipe interface not loading causes**
A: Check if causes exist in database and API endpoint `/api/causes` returns data

**Q: Admin can't see NGOs**
A: NGO role must be `'organisation'` not `'ngo'` in database

---

## 📚 Additional Resources

- **Main README**: See `README.md` for features overview
- **GitHub**: https://github.com/VismayHS/ImpactMatch
- **MongoDB Docs**: https://docs.mongodb.com/
- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/

---

## ✅ Current Status

- ✅ **Frontend**: All 19 dashboard pages complete
- ✅ **Backend**: All API endpoints working
- ✅ **Authentication**: JWT-based with role checking
- ✅ **Database**: MongoDB with 4 collections
- ✅ **File Uploads**: Certificate and image uploads working
- ✅ **PDF Reports**: 3 report types with jsPDF
- ✅ **No Duplicate Systems**: Single admin dashboard only

---

*Last Updated: October 31, 2025*  
*Version: 2.0 - Complete Dashboard System*
