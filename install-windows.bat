@echo off
echo ========================================
echo DLS Calculator - Frontend Setup (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and add it to your PATH
    echo See SETUP_WINDOWS.md for instructions
    pause
    exit /b 1
)

echo [1/2] Node.js found:
node -v
echo.

REM Check if npm is installed
npm -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    echo npm should come with Node.js installation
    pause
    exit /b 1
)

echo [2/2] npm found:
npm -v
echo.

REM Install dependencies
echo Installing Node.js dependencies...
echo This may take a few minutes...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
pause


