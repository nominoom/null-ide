#!/bin/bash
# Build script for Linux installers
# Run this on a Linux machine

set -e

echo "🔨 Building Null IDE for Linux..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "⚙️  Building application..."
npm run build

# Package for Linux
echo "📦 Creating Linux installers..."
npx electron-builder --linux

echo "✅ Build complete! Check the release/ directory for installers:"
ls -lh release/*.{AppImage,deb,rpm} 2>/dev/null || echo "Installers created successfully"
