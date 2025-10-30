# ImpactMatch Admin Panel

## 🎯 Overview
A complete admin panel system for ImpactMatch with full backend integration, user management, NGO verification workflow, and activity logging.

## 🔑 Admin Credentials
- **Email**: admin@impactmatch.com
- **Password**: admin123

## 🚀 Features

### 1. **Dashboard Overview**
- Total users, organizations, and NGOs statistics
- Pending NGO verifications count
- User growth chart with monthly trends
- System status indicators
- Quick action buttons

### 2. **User Management**
- View all registered users (Individuals, Organizations, NGOs, Admins)
- Search by name or email
- Filter by role and verification status
- Pagination support (20 users per page)
- View detailed user information
- Deactivate users (soft delete)

### 3. **NGO Verification**
- View all NGO certificate submissions
- Preview uploaded certificates (PDF/JPEG/PNG)
- Approve/Reject NGOs with notes
- Status tracking (Pending, Approved, Rejected)
- Verification notes display on hover

### 4. **Activity Logs**
- Monitor all system activities
- Filter by action type (login, register, verification, etc.)
- Filter by user type (Individual, Organization, NGO, Admin)
- Date range filtering
- Export logs as CSV (up to 5000 entries)
- Pagination support (50 logs per page)

## 🔧 Backend Architecture

### Models
- **User** - Enhanced with admin role support
- **NGODetails** - Stores NGO certificate info and verification status
- **ActivityLog** - Tracks all system events with metadata

### Routes
All admin routes are protected with JWT authentication:
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - User list with filters
- `GET /api/admin/users/:id` - User details
- `GET /api/admin/ngos/certificates` - NGO certificate list
- `POST /api/admin/ngos/:id/verify` - Approve/reject NGO
- `GET /api/admin/logs` - Activity logs with filters
- `GET /api/admin/logs/export` - Export logs as CSV
- `DELETE /api/admin/users/:id` - Deactivate user

### Authentication
- JWT tokens with 7-day expiration
- Stored in localStorage as 'adminToken'
- Protected routes check for valid token and admin role

### File Upload
- NGO certificates stored in `uploads/certificates/`
- Supported formats: PDF, JPEG, PNG
- Maximum file size: 5MB
- Unique filenames: `{userId}-{timestamp}-{random}-{original}`

## 📱 Frontend Components

### Admin Pages
- **AdminLogin.jsx** - Glassmorphic login page with gradient background
- **AdminDashboard.jsx** - Overview with stats cards and growth chart
- **UserManagement.jsx** - User table with search, filter, pagination
- **NGOVerification.jsx** - Certificate verification interface with modal
- **ActivityLogs.jsx** - Logs table with filters and CSV export

### Reusable Components
- **Sidebar.jsx** - Navigation sidebar with active state
- **StatsCard.jsx** - Dashboard statistics card with icons

## 🎨 Design System

### Colors
- **Primary Gradient**: Teal (#00C6A7) → Blue (#007CF0) → Violet (#8E2DE2)
- **Glassmorphic Effect**: `backdrop-blur-xl bg-white/10 border border-white/20`
- **Status Colors**:
  - Pending: Yellow (#FBBF24)
  - Approved: Green (#10B981)
  - Rejected: Red (#EF4444)
  - Admin: Orange (#F97316)

### Typography
- **Headings**: Bold, white color
- **Body**: White with 70% opacity
- **Icons**: Lucide React icons

## 🔄 User Registration Flow

### Individual Users
1. Fill registration form (name, email, password, location, interests)
2. Auto-verified on registration
3. Redirect to swipe page

### Organizations
1. Fill organization form (name, email, password, office address)
2. Auto-verified on registration
3. Redirect to swipe page

### NGOs
1. Fill NGO form (name, email, password)
2. Upload government certificate (PDF/JPEG/PNG)
3. Set as unverified (verified=false)
4. Certificate uploaded to server via multipart/form-data
5. Redirect to dashboard with "pending verification" message
6. Admin reviews certificate and approves/rejects
7. NGO status updated accordingly

## 📊 Activity Logging

All user actions are automatically logged:
- User login/logout
- User registration (Individual/Organization/NGO)
- NGO certificate upload
- NGO verification (approved/rejected)
- User deactivation
- Admin actions

Each log entry includes:
- Timestamp
- Action type
- User ID and type
- Performed by (for admin actions)
- IP address
- User agent
- Additional metadata

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd client
npm install recharts axios react-router-dom
```

### 2. Create Admin User
```bash
cd ..
node data/createAdmin.js
```

### 3. Create Uploads Directory
```bash
mkdir -p uploads/certificates
```

### 4. Start Servers
```bash
# Terminal 1: Backend
node server.js

# Terminal 2: Frontend
cd client
npm run dev
```

### 5. Access Admin Panel
Navigate to: `http://localhost:5173/admin/login`

## 🔐 Security Features
- JWT token-based authentication
- Admin role verification on all protected routes
- Password hashing with bcrypt
- File type and size validation for uploads
- CORS enabled for cross-origin requests
- Activity logging for audit trail

## 📝 Notes
- All timestamps use local timezone
- User deactivation is soft delete (sets verified=false)
- CSV exports limited to 5000 entries for performance
- Certificate files served statically from `/uploads` route
- Activity logs indexed on timestamp, userId, and action for fast queries

## 🚦 Testing Workflow

### 1. Test Admin Login
- Go to `/admin/login`
- Login with admin credentials
- Verify JWT token stored in localStorage
- Check redirect to dashboard

### 2. Test Dashboard
- Verify statistics display correctly
- Check user growth chart loads
- Test quick action buttons

### 3. Test NGO Registration & Verification
- Register as NGO with certificate upload
- Login as admin
- Go to NGO Verification page
- Preview certificate
- Approve/Reject with notes
- Verify user status updated
- Check activity logs show verification

### 4. Test User Management
- View all users
- Test search functionality
- Test role and status filters
- View user details
- Test deactivation

### 5. Test Activity Logs
- View recent activities
- Test action type filter
- Test user type filter
- Test date range filter
- Export logs as CSV

## 🎯 Next Steps
- [ ] Email notifications for NGO verification
- [ ] Advanced analytics and reporting
- [ ] Bulk user operations
- [ ] Role-based permissions (Super Admin vs Admin)
- [ ] Two-factor authentication for admins
- [ ] Real-time notifications with WebSocket
- [ ] Certificate OCR for automatic registration number extraction
- [ ] Audit trail with change history

## 📞 Support
For issues or questions, contact the development team.

---

**Built with ❤️ for ImpactMatch**
