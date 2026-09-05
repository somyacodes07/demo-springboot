#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting Spring Boot Backend on http://localhost:8080..."
cd "$DIR/backend" || exit 1
chmod +x ./mvnw 2>/dev/null
./mvnw spring-boot:run
