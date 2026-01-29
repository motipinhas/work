#!/bin/bash

# Simple server script for running the built application
# This script starts a local HTTP server to run the dashboard

PORT=${1:-3000}
DIR="dist"

if [ ! -d "$DIR" ]; then
    echo "Error: $DIR directory not found!"
    echo "Please run 'npm run build' first to create the build."
    exit 1
fi

echo "Starting server on http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

# Prefer npx serve (supports SPA routing) over Python's basic server
if command -v npx &> /dev/null; then
    cd "$DIR" && npx serve -p "$PORT" --single
elif command -v python3 &> /dev/null; then
    cd "$DIR" && python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
    cd "$DIR" && python -m SimpleHTTPServer "$PORT"
else
    echo "Error: No suitable server found!"
    echo "Please install Node.js (recommended) or Python 3 to run this server."
    exit 1
fi


