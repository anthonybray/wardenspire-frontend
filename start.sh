#!/bin/bash

########################################
############ Wardenspire Start Script ##############
########################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Ensure venv exists
if [ ! -d "backend/.venv" ]; then
  echo "Creating backend venv..."
  cd backend
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  cd ..
fi

# Ensure frontend deps are installed
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

########################################
############ Start API (backend) ##############
########################################

start_api() {
  cd "$SCRIPT_DIR/backend"
  source .venv/bin/activate
  python run.py
}

########################################
############ Start Frontend ##############
########################################

start_frontend() {
  cd "$SCRIPT_DIR/frontend"
  npm run dev
}

########################################
############ Run both in parallel ##############
########################################

echo "Starting Wardenspire..."
echo "  API:      http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both."
echo ""

# Trap Ctrl+C to kill both processes
cleanup() {
  echo ""
  echo "Stopping Wardenspire..."
  kill $API_PID $FRONTEND_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# Start API in background
start_api &
API_PID=$!

# Give API a moment to start
sleep 2

# Start frontend in background
start_frontend &
FRONTEND_PID=$!

# Wait for either to exit (or Ctrl+C)
wait
