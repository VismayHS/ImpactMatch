# Quick Start Script for NGO Verification Engine

Write-Host "🚀 Starting ImpactMatch NGO Verification Engine..." -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "📋 Checking Python..." -ForegroundColor Yellow
python --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python not found! Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python installed" -ForegroundColor Green
Write-Host ""

# Navigate to ai-model directory
Set-Location -Path "ai-model"

# Check if dependencies are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

$testImport = python -c "import flask, transformers, torch, bs4, duckduckgo_search; print('OK')" 2>&1

if ($testImport -match "OK") {
    Write-Host "✅ All dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

Write-Host ""

# Start Flask app
Write-Host "🔥 Starting Flask AI service on http://localhost:8000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "📝 Available Endpoints:" -ForegroundColor Yellow
Write-Host "   • GET  http://localhost:8000/health" -ForegroundColor White
Write-Host "   • POST http://localhost:8000/verify_ngo" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test with:" -ForegroundColor Yellow
Write-Host '   curl -X POST http://localhost:8000/verify_ngo `' -ForegroundColor Gray
Write-Host '     -H "Content-Type: application/json" `' -ForegroundColor Gray
Write-Host '     -d "{\"ngo_name\": \"Akshaya Patra Foundation\"}"' -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "⌨️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py
