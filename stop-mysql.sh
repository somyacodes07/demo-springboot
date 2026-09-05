#!/bin/bash
echo "Stopping MySQL Server on macOS..."

if command -v brew &> /dev/null; then
    brew services stop mysql
elif command -v mysql.server &> /dev/null; then
    mysql.server stop
else
    echo "MySQL command not found in PATH."
fi
