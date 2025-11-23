@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    6IX Clothing Brand - Startup Script
echo ========================================
echo.

:: Function to check if a port is in use
:check_port
set port=%1
netstat -an | find ":%port% " >nul 2>&1
if errorlevel 1 (
    echo Port %port% is available
    exit /b 0
) else (
    echo WARNING: Port %port% is already in use!
    echo Please stop the service using this port or choose a different port.
    exit /b 1
)

:: Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Minimum required version: Node.js 16.x or higher
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
    echo ✅ Node.js !node_version! is installed
)

:: Check if npm is available
echo [2/6] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm is not available!
    echo Please reinstall Node.js to include npm
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
    echo ✅ npm !npm_version! is available
)

:: Check if serve is installed globally
echo [3/6] Checking for serve package...
npx serve --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  serve package not found, installing globally...
    npm install -g serve
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install serve package!
        echo Please run: npm install -g serve
        pause
        exit /b 1
    )
) else (
    echo ✅ serve package is available
)

:: Check MongoDB connection
echo [4/6] Checking MongoDB connection...
echo ⚠️  Make sure MongoDB is running locally or update MONGO_URI in backend/config.env
echo    You can start MongoDB with: mongod
echo.

:: Check if backend directory exists
if not exist "backend" (
    echo ❌ ERROR: Backend directory not found!
    echo Please make sure you're running this script from the project root.
    pause
    exit /b 1
)

:: Check if backend package.json exists
if not exist "backend\package.json" (
    echo ❌ ERROR: Backend package.json not found!
    echo Please make sure the backend directory contains package.json
    pause
    exit /b 1
)

:: Install backend dependencies
echo [5/6] Installing backend dependencies...
cd backend
npm install
if errorlevel 1 (
    echo ❌ ERROR: Failed to install backend dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully

:: Seed database
echo [6/6] Seeding database...
npm run seed
if errorlevel 1 (
    echo ⚠️  WARNING: Database seeding failed!
    echo The server will still start, but you may need to seed manually.
) else (
    echo ✅ Database seeded successfully
)

:: Check if ports are available
echo.
echo Checking port availability...
call :check_port 5000
if errorlevel 1 (
    echo Please stop the service on port 5000 or modify the backend port.
    pause
    exit /b 1
)

call :check_port 8000
if errorlevel 1 (
    echo Please stop the service on port 8000 or modify the frontend port.
    pause
    exit /b 1
)

:: Start backend server
echo.
echo 🚀 Starting backend server...
start "6IX Backend Server" cmd /k "echo Backend Server Starting... && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server
echo 🚀 Starting frontend server...
cd ..
start "6IX Frontend Server" cmd /k "echo Frontend Server Starting... && npx serve . -p 8000"

:: Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

:: Open browser
echo 🌐 Opening browser...
start http://localhost:8000/html/index.html

echo.
echo ========================================
echo           🎉 SUCCESS! 🎉
echo ========================================
echo.
echo ✅ Backend server: http://localhost:5000
echo ✅ Frontend server: http://localhost:8000
echo ✅ Website: http://localhost:8000/html/index.html
echo.
echo Both servers are now running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this script...
pause >nul 