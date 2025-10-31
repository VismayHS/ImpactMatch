# 🔧 Server Stability Guide - Fix Frontend Stopping Issues

## Problem: Frontend Server Keeps Stopping

If your Vite development server (port 3000) keeps stopping, here are the causes and solutions:

---

## ✅ SOLUTIONS IMPLEMENTED

### 1. **Startup Scripts Created**
Run one of these to start both servers in **separate windows** (so they don't interfere with each other):

**Option A: PowerShell Script (Recommended)**
```powershell
.\start-servers.ps1
```

**Option B: Batch File (Simpler)**
```cmd
start-servers.bat
```

**Benefits:**
- ✅ Both servers run in **separate windows**
- ✅ Won't stop when you run other commands
- ✅ Auto-cleanup of old processes
- ✅ Health checks included
- ✅ Clear status messages

### 2. **Vite Configuration Enhanced**
Updated `client/vite.config.js` with:
- **File watching improvements** (usePolling for Windows)
- **Error overlay** (shows errors without crashing)
- **Port flexibility** (fallback if 3000 is taken)
- **Better proxy configuration** with WebSocket support

### 3. **Global Error Handlers Added**
Updated `client/src/main.jsx` with:
- **Window error handler** - catches uncaught errors
- **Unhandled rejection handler** - catches promise errors
- **Prevents app crashes** from propagating

### 4. **Null Safety in Registration**
Fixed `client/src/components/Register.jsx`:
- Added null checks for `response.data.user`
- Added fallback values
- Better error messages

---

## 🚨 Common Causes of Frontend Stopping

### Cause 1: Running Commands in Same Terminal
**Problem:** When you run commands (like `git`, `curl`, etc.) in the terminal where Vite is running, it interrupts the process.

**Solution:** Use the startup scripts which open **separate windows** for each server.

### Cause 2: Uncaught Errors in React Code
**Problem:** JavaScript errors in React components can crash the dev server.

**Solution:** 
- Global error handlers now catch these
- ErrorBoundary wraps the entire app
- Errors show as overlays instead of crashes

### Cause 3: Port Conflicts
**Problem:** Something else using port 3000.

**Solution:**
- Vite now tries next available port automatically
- Startup scripts kill old processes first

### Cause 4: File Watching Issues on Windows
**Problem:** Vite's default file watcher doesn't work well on Windows.

**Solution:**
- Now using `usePolling: true` for reliable file watching
- Interval set to 100ms for fast updates

### Cause 5: Memory/Resource Issues
**Problem:** Long-running Vite process consumes memory.

**Solution:**
- Restart servers periodically using the scripts
- Close other heavy applications

### Cause 6: CORS or Proxy Errors
**Problem:** Failed API calls to backend crash frontend.

**Solution:**
- Improved proxy configuration
- Better error handling in API calls
- WebSocket support added

---

## 📋 How to Start Servers (RECOMMENDED WAY)

### Method 1: Use Startup Scripts (BEST)

1. **Open PowerShell in project root**
   ```powershell
   cd C:\Users\visma\Downloads\ImpactMatch
   ```

2. **Run the startup script**
   ```powershell
   .\start-servers.ps1
   ```
   OR
   ```cmd
   start-servers.bat
   ```

3. **Two windows will open:**
   - Window 1: Backend Server (green header)
   - Window 2: Frontend Server (blue header)

4. **IMPORTANT:** DO NOT close these windows!

5. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5173

### Method 2: Manual Start (If scripts don't work)

**Terminal 1 - Backend:**
```powershell
cd C:\Users\visma\Downloads\ImpactMatch\impactmatch
npm start
# Keep this window open
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\visma\Downloads\ImpactMatch\client
npm run dev
# Keep this window open
```

**Terminal 3 - For your commands:**
```powershell
cd C:\Users\visma\Downloads\ImpactMatch
# Use this terminal for git, testing, etc.
```

---

## 🛑 How to Stop Servers

### Option 1: Close Windows
Simply close the server windows created by startup scripts.

### Option 2: Ctrl+C
Press `Ctrl+C` in each server window.

### Option 3: Kill All Node Processes
```powershell
Get-Process node | Stop-Process -Force
```

---

## ✅ Verify Servers Are Running

**Check Processes:**
```powershell
Get-Process node | Select-Object Id, ProcessName, StartTime
```

**Check Ports:**
```powershell
netstat -ano | Select-String ":3000|:5173" | Select-String "LISTENING"
```

**Test Backend:**
```powershell
Invoke-WebRequest http://localhost:5173/health
```

**Test Frontend:**
Open browser to http://localhost:3000

---

## 🔍 Troubleshooting

### Frontend Won't Start
1. **Check if port 3000 is free:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
   ```

2. **Kill processes on port 3000:**
   ```powershell
   netstat -ano | findstr :3000
   # Find PID, then:
   Stop-Process -Id <PID> -Force
   ```

3. **Reinstall dependencies:**
   ```powershell
   cd client
   Remove-Item node_modules -Recurse -Force
   npm install
   ```

### Backend Won't Start
1. **Check MongoDB is running:**
   ```powershell
   Get-Process mongod -ErrorAction SilentlyContinue
   ```
   If not running:
   ```powershell
   net start MongoDB
   ```

2. **Check if port 5173 is free:**
   ```powershell
   netstat -ano | findstr :5173
   ```

3. **Check backend logs** in the server window for errors

### Both Servers Stop After Some Time
1. **Check available RAM:**
   ```powershell
   Get-WmiObject Win32_OperatingSystem | Select-Object FreePhysicalMemory
   ```

2. **Close unnecessary applications**

3. **Restart servers using the script**

### Errors After Code Changes
1. **Hard refresh browser:** Ctrl+Shift+R or Cmd+Shift+R
2. **Clear browser cache**
3. **Restart frontend server**

---

## 💡 Best Practices

### DO ✅
- Use startup scripts to launch servers
- Keep server windows open and visible
- Run git/testing commands in a SEPARATE terminal
- Hard refresh browser after code changes
- Check server windows for error messages

### DON'T ❌
- Don't run commands in server terminals
- Don't close server windows
- Don't press Ctrl+C in server windows accidentally
- Don't modify files while servers are restarting
- Don't have multiple Vite instances running

---

## 🐛 Known Issues & Fixes

### Issue: "EADDRINUSE: Port already in use"
**Fix:** Kill all node processes first
```powershell
Get-Process node | Stop-Process -Force
```

### Issue: Vite shows blank page after restart
**Fix:** Hard refresh browser (Ctrl+Shift+R)

### Issue: Hot reload not working
**Fix:** Now using polling mode - should work automatically

### Issue: "Cannot read properties of null"
**Fix:** Already fixed with null checks in Register.jsx

### Issue: MongoDB connection errors
**Fix:** Start MongoDB:
```powershell
net start MongoDB
```

---

## 📊 Server Status Dashboard

You can quickly check status with:

```powershell
# One-liner to check everything
Write-Host "=== SERVER STATUS ===" -ForegroundColor Cyan; `
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, StartTime; `
netstat -ano | Select-String ":3000|:5173" | Select-String "LISTENING"; `
try { Invoke-WebRequest http://localhost:5173/health -UseBasicParsing | Select-Object StatusCode } catch { Write-Host "Backend: DOWN" -ForegroundColor Red }; `
try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 2 | Select-Object StatusCode } catch { Write-Host "Frontend: DOWN" -ForegroundColor Red }
```

---

## 📞 Still Having Issues?

If servers still stop frequently:

1. **Check Windows Event Viewer** for Node.js crashes
2. **Update Node.js** to latest LTS version
3. **Disable antivirus temporarily** (it might be killing processes)
4. **Check disk space** - ensure you have enough free space
5. **Run as Administrator** - right-click PowerShell → Run as Administrator

---

## ✨ Summary of All Fixes

| Issue | Fix Applied |
|-------|-------------|
| Frontend stops when running commands | ✅ Startup scripts with separate windows |
| Uncaught errors crash app | ✅ Global error handlers in main.jsx |
| Null pointer in registration | ✅ Added null checks and fallbacks |
| File watching issues on Windows | ✅ Vite config with usePolling |
| Port conflicts | ✅ strictPort: false, auto-cleanup |
| CORS errors | ✅ Improved proxy configuration |
| WebSocket issues | ✅ Added ws: true to proxy |
| Error overlay crashes dev server | ✅ hmr.overlay enabled |

---

## 🎯 Next Steps

1. **Stop current servers** (if running)
2. **Run the startup script:**
   ```powershell
   .\start-servers.ps1
   ```
3. **Test registration** with a fresh browser window
4. **Servers should stay running** even if you run other commands

---

**Last Updated:** October 31, 2025  
**Status:** All stability fixes applied ✅
