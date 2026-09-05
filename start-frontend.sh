#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting React Frontend on http://localhost:5173..."
cd "$DIR/frontend" || exit 1
npm run dev
