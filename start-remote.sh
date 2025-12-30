#!/bin/bash

echo "========================================"
echo "Starting DLS Frontend on Remote Server"
echo "========================================"
echo ""

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Server IP: $SERVER_IP"
echo ""

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use!"
    echo "   Kill the process or use a different port"
    exit 1
fi

echo "Starting React dev server..."
echo "Access at: http://$SERVER_IP:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start dev server on all interfaces
npm run dev -- --host 0.0.0.0


