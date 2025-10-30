# 🔧 NGO Registration Troubleshooting Guide

## Issue Reported
NGO registration failing when downloading and running the project.

---

## Common Issues & Solutions

### 1. Backend Server Not Running
**Symptom**: Registration fails immediately, network errors in browser console

**Solution**:
```powershell
# Start backend server
cd impactmatch
npm start
# Should see: "✓ MongoDB connected" and "✓ ImpactMatch server running on port 5173"
```

**Verify**:
```powershell
# Test health endpoint
curl http://localhost:5173/health
# Should return: {"status":"ok","message":"ImpactMatch API is running"}
```

---

### 2. MongoDB Not Running
**Symptom**: Backend crashes with "MongoNetworkError" or "ECONNREFUSED"

**Solution**:
```powershell
# Windows - Start MongoDB service
net start MongoDB

# Check MongoDB is running
mongosh
# Should connect without errors
```

**Alternative - Use MongoDB Atlas** (Cloud):
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `impactmatch/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/impactmatch
   ```

---

### 3. Missing Dependencies
**Symptom**: Module not found errors, import errors

**Solution**:
```powershell
# Backend dependencies
cd impactmatch
npm install

# Frontend dependencies
cd ../client
npm install
```

---

### 4. CORS Errors
**Symptom**: Browser console shows "CORS policy blocked" or "No 'Access-Control-Allow-Origin'"

**Check `impactmatch/server.js`**:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Must match frontend URL
  credentials: true
}));
```

**If frontend runs on different port**, update this line.

---

### 5. File Upload Issues (NGO Certificate)
**Symptom**: "File upload failed" or "certificate upload failed"

**Causes**:
- File too large (> 5MB)
- Wrong file type (only PDF, JPG, PNG allowed)
- Upload directory doesn't exist
- Missing multer configuration

**Solution**:
```powershell
# Ensure uploads directory exists
cd impactmatch
mkdir uploads\certificates -Force

# Verify multer is installed
npm list multer
# Should show: multer@1.4.5-lts.1
```

**Test file upload endpoint**:
```powershell
# Using curl (if installed)
curl -X POST http://localhost:5173/api/users/upload-certificate `
  -F "certificate=@path/to/test.pdf" `
  -F "userId=YOUR_USER_ID" `
  -F "registrationNumber=TEST123"
```

---

### 6. API URL Mismatch
**Symptom**: Network errors, 404 not found

**Check `client/.env`**:
```env
VITE_API_URL=http://localhost:5173/api
```

**Check `client/src/constants.js`**:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';
```

---

### 7. Environment Variables Not Loaded
**Symptom**: Backend can't connect to database, undefined variables

**Solution**:
```powershell
# Backend - Create .env file
cd impactmatch
copy .env.example .env

# Edit .env with actual values
notepad .env
```

**Required variables**:
```env
MONGODB_URI=mongodb://localhost:27017/impactmatch
JWT_SECRET=your_secure_secret_key_here_change_this
PORT=5173
```

```powershell
# Frontend - Create .env file
cd client
copy .env.example .env

# Edit .env
notepad .env
```

**Required variables**:
```env
VITE_API_URL=http://localhost:5173/api
```

---

## Step-by-Step Testing

### Test 1: Backend Health Check
```powershell
# Terminal 1 - Start backend
cd C:\Users\visma\Downloads\ImpactMatch\impactmatch
npm start

# Terminal 2 - Test endpoint
curl http://localhost:5173/health
```

**Expected**: `{"status":"ok","message":"ImpactMatch API is running"}`

---

### Test 2: Frontend Running
```powershell
# Terminal 3 - Start frontend
cd C:\Users\visma\Downloads\ImpactMatch\client
npm run dev

# Should show: "Local: http://localhost:3000"
# Open browser: http://localhost:3000
```

---

### Test 3: Individual Registration (Simplest)
1. Open http://localhost:3000/register
2. Click "Individual" tab
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Location: Bangalore
   - Interests: Environment, Education
4. Click "Start Making Impact"

**Check browser console (F12)** for errors.

---

### Test 4: NGO Registration (Complex)
1. Open http://localhost:3000/register
2. Click "NGO" tab
3. Fill form:
   - NGO Name: Test NGO
   - Email: testngo@example.com
   - Password: test123
   - Certificate: Upload any PDF < 5MB
4. Click "Register NGO"

**Watch for**:
- Certificate upload success toast
- Registration success toast
- Redirect to dashboard

---

## Debugging NGO Registration

### Check Browser Console (F12)
Look for errors in:
- **Console tab**: JavaScript errors, API errors
- **Network tab**: Failed requests (red), status codes, response data

### Common Error Messages

#### "Please fill in all required fields and upload a certificate"
- **Cause**: Form validation failed
- **Fix**: Ensure all fields filled and file selected

#### "File size must be less than 5MB"
- **Cause**: Certificate file too large
- **Fix**: Compress PDF or use smaller file

#### "Please upload a PDF or JPEG/PNG image"
- **Cause**: Invalid file type
- **Fix**: Only use .pdf, .jpg, .jpeg, or .png files

#### "Registration failed. Please try again."
- **Cause**: Backend error
- **Fix**: Check backend terminal for error logs

#### "Certificate upload failed"
- **Cause**: File upload endpoint error
- **Fix**: 
  1. Check `impactmatch/uploads/certificates/` exists
  2. Check backend logs for multer errors
  3. Verify multer is installed: `npm list multer`

---

## Backend Error Logs

### Check Terminal Output
When registration happens, backend should show:
```
POST /api/users/register 201 - 156ms
POST /api/users/upload-certificate 200 - 89ms
```

### Common Backend Errors

#### "EADDRINUSE: address already in use"
```powershell
# Port 5173 is busy - kill existing process
netstat -ano | findstr :5173
# Note the PID, then:
taskkill /PID <PID> /F
```

#### "MongooseError: Operation users.insertOne() buffering timed out"
```powershell
# MongoDB not connected
# Start MongoDB:
net start MongoDB

# Or use MongoDB Atlas cloud connection
```

#### "MulterError: Unexpected field"
- **Cause**: Form field name mismatch
- **Fix**: Ensure frontend sends `certificate` field name (check `Register.jsx` line 192)

---

## Test with Postman/Thunder Client

### Test Backend Directly

**1. Test Registration (Without File)**
```
POST http://localhost:5173/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "city": "Bangalore",
  "interests": "Environment, Education",
  "role": "user"
}
```

**Expected**: Status 201, returns user object with `userId`

**2. Test NGO Registration**
```
POST http://localhost:5173/api/users/register
Content-Type: application/json

{
  "name": "Test NGO",
  "email": "testngo@example.com",
  "password": "test123",
  "city": "Multiple Cities",
  "interests": "Social Impact",
  "role": "ngo",
  "certificateUploaded": true,
  "verified": false
}
```

**3. Test File Upload**
```
POST http://localhost:5173/api/users/upload-certificate
Content-Type: multipart/form-data

Form Data:
- certificate: [Select PDF file]
- userId: [User ID from step 2]
- registrationNumber: TEST123
```

---

## Quick Fix Script

Create `test-ngo-registration.js` in `impactmatch/` folder:

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testNGORegistration() {
  try {
    // Step 1: Register NGO user
    console.log('Testing NGO registration...');
    const registerResponse = await axios.post('http://localhost:5173/api/users/register', {
      name: 'Test NGO',
      email: 'testngo' + Date.now() + '@example.com',
      password: 'test123',
      city: 'Multiple Cities',
      interests: 'Social Impact',
      role: 'ngo',
      certificateUploaded: true,
      verified: false,
    });

    console.log('✅ Registration successful:', registerResponse.data);
    const userId = registerResponse.data.userId;

    // Step 2: Test file upload (create dummy PDF)
    console.log('\nTesting certificate upload...');
    
    // Create dummy PDF content
    const dummyPDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF');
    
    const formData = new FormData();
    formData.append('certificate', dummyPDF, {
      filename: 'test-certificate.pdf',
      contentType: 'application/pdf',
    });
    formData.append('userId', userId);
    formData.append('registrationNumber', 'TEST-' + Date.now());

    const uploadResponse = await axios.post(
      'http://localhost:5173/api/users/upload-certificate',
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    console.log('✅ Certificate upload successful:', uploadResponse.data);
    console.log('\n🎉 NGO registration flow working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Stack:', error.stack);
  }
}

testNGORegistration();
```

**Run test**:
```powershell
cd impactmatch
node test-ngo-registration.js
```

---

## For Your Friend

### Quick Setup Checklist

1. **Install Dependencies**
   ```powershell
   cd impactmatch
   npm install
   cd ../client
   npm install
   ```

2. **Start MongoDB**
   ```powershell
   net start MongoDB
   ```

3. **Create Environment Files**
   ```powershell
   cd impactmatch
   copy .env.example .env
   cd ../client
   copy .env.example .env
   ```

4. **Seed Database**
   ```powershell
   cd impactmatch
   node data/createDemoData.js
   node data/createAdmin.js
   ```

5. **Start Servers**
   ```powershell
   # Terminal 1 - Backend
   cd impactmatch
   npm start

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Test Registration**
   - Open http://localhost:3000/register
   - Try Individual first (simplest)
   - Then try NGO with a small PDF file

---

## Still Having Issues?

### Collect Debug Info

1. **Backend logs**: Copy full terminal output
2. **Frontend console**: Open DevTools (F12) → Console tab → Copy all errors
3. **Network tab**: DevTools → Network → Find failed request → Copy Response
4. **Environment**:
   ```powershell
   node --version  # Should be v16+
   npm --version   # Should be v7+
   mongosh --version
   ```

5. **File structure**:
   ```powershell
   cd impactmatch
   dir uploads\certificates
   # Should show certificates folder exists
   ```

### Share These Details
- Node.js version
- Operating system
- Exact error message
- Browser console errors
- Backend terminal output

---

## Working Demo Credentials

If NGO registration is still failing, use existing demo account:

```
Email: vismay@example.com
Password: demo123
Role: Individual User
```

Or login as admin to manually verify NGOs:
```
Email: admin@impactmatch.com
Password: admin123
```

---

**Last Updated**: October 30, 2025
**For**: ImpactMatch v1.0
