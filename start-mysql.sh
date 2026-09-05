#!/bin/bash
echo "Starting MySQL Server on macOS..."

if command -v brew &> /dev/null; then
    brew services start mysql
elif command -v mysql.server &> /dev/null; then
    mysql.server start
else
    echo "MySQL command not found in PATH."
    echo "If installed via Homebrew, run: brew install mysql && brew services start mysql"
fi
