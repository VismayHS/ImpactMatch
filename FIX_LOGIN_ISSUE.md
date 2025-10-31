# Fix Login Issue - Clear LocalStorage

## Problem
Error: "TypeError: Cannot read properties of null (reading 'name')"

## Cause
Your browser's localStorage has old or corrupted user data from previous login sessions.

## Solution

### Option 1: Clear LocalStorage (Recommended)
1. Open the browser console (Press F12)
2. Go to the **Console** tab
3. Type this command and press Enter:
   ```javascript
   localStorage.clear()
   ```
4. Refresh the page (F5)
5. Log in again

### Option 2: Clear Specific Items
1. Open the browser console (Press F12)
2. Run these commands one by one:
   ```javascript
   localStorage.removeItem('user')
   localStorage.removeItem('token')
   localStorage.removeItem('userId')
   localStorage.removeItem('userName')
   ```
3. Refresh the page
4. Log in again

### Option 3: Use Application Tab
1. Press F12 to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. In the left sidebar, find **Local Storage**
4. Click on your website URL (http://localhost:3001)
5. Click the **Clear All** button (trash icon)
6. Refresh the page
7. Log in again

## Test Login Credentials

### Test NGO Account:
- Email: `test@ngo.com`
- Password: `demo123`

### Create New NGO:
1. Click "Register"
2. Select "NGO" as organization type
3. Fill in the form
4. Upload a registration certificate
5. Submit and wait for admin verification

## Changes Made
✅ Added loading state to prevent rendering before user data loads
✅ Added validation to check user data has required fields (name, role)
✅ Added error handling for corrupted localStorage data
✅ Auto-redirect to login if user data is invalid

## Next Steps
After clearing localStorage and logging in again:
1. The NGO Dashboard should load without errors
2. All 6 pages should be accessible
3. Data should load from the backend properly

## Servers Running
- **Frontend**: http://localhost:3001/
- **Backend**: http://localhost:5173/
- **MongoDB**: localhost:27017/impactmatch
