#!/bin/bash
echo "=========================================="
echo "Starting Student Management Fullstack App"
echo "=========================================="

DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Start MySQL Server
"$DIR/start-mysql.sh"

# 2. Start Spring Boot Backend
echo "Starting Spring Boot Backend..."
(cd "$DIR/backend" && chmod +x ./mvnw 2>/dev/null && ./mvnw spring-boot:run) &
BACKEND_PID=$!

# 3. Start React Frontend
echo "Starting React Frontend..."
(cd "$DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "All services launched!"
echo "- Backend API:  http://localhost:8080"
echo "- Frontend App: http://localhost:5173"
echo "Press Ctrl+C to terminate all services."
echo "=========================================="

cleanup() {
    echo ""
    echo "Stopping fullstack services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
