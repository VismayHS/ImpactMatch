# PowerShell script to start both servers in separate windows
# This prevents accidental Ctrl+C from stopping servers

Write-Host "🚀 Starting ImpactMatch Servers..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
        Write-Host "   Windows: net start MongoDB" -ForegroundColor Yellow
        Write-Host "   Or run: mongod" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""

# Kill existing Node processes on ports 5173 and 3000
Write-Host "Cleaning up existing servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend Server in new window
Write-Host "Starting Backend Server (Port 5173)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "impactmatch"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm start" -WindowStyle Normal

Write-Host "✅ Backend server started in new window" -ForegroundColor Green
Start-Sleep -Seconds 3

# Start Frontend Server in new window
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '⚛️  Frontend Server (Vite)' -ForegroundColor Blue; npm run dev" -WindowStyle Normal

Write-Host "✅ Frontend server started in new window" -ForegroundColor Green
Write-Host ""

# Wait for servers to start
Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if servers are running
Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Yellow

$backendRunning = $false
$frontendRunning = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "✅ Backend Server: RUNNING (http://localhost:5173)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend Server: NOT RESPONDING" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
        Write-Host "✅ Frontend Server: RUNNING (http://localhost:3000)" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend Server: Starting... (may take a few more seconds)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 ImpactMatch Servers Started!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend API:  http://localhost:5173" -ForegroundColor White
Write-Host "📍 Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Both servers are running in SEPARATE windows" -ForegroundColor White
Write-Host "   - DO NOT close the server windows" -ForegroundColor White
Write-Host "   - To stop: Close the server windows or press Ctrl+C in each" -ForegroundColor White
Write-Host "   - To restart: Run this script again" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Demo Credentials:" -ForegroundColor Yellow
Write-Host "   User: vismay@example.com | Password: demo123" -ForegroundColor White
Write-Host "   Admin: admin@impactmatch.com | Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
