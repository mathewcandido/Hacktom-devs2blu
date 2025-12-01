#!/bin/bash

# Build and run the Docker container for the Talent Incubator Platform

echo "🚀 Building Talent Incubator Frontend Docker image..."
docker build -t talent-incubator-frontend .

echo "✅ Build completed!"
echo "🏃 Running the container..."

# Remove existing container if it exists
docker rm -f talent-incubator-app 2>/dev/null || true

# Run new container
docker run -p 3000:3000 --name talent-incubator-app talent-incubator-frontend

echo "🌐 Application running at http://localhost:3000"