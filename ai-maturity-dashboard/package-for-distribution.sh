#!/bin/bash

# Script to package the application for distribution
# This creates a ready-to-share zip file

set -e

echo "📦 Packaging AI Maturity Dashboard for Distribution..."
echo ""

# Build the application
echo "🔨 Building application..."
npm run build

# Create distribution folder
VERSION=$(node -p "require('./package.json').version")
DIST_NAME="ai-maturity-dashboard-v${VERSION}"
DIST_DIR="distribution-package"

echo "📁 Creating distribution package..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy necessary files
cp -r dist "$DIST_DIR/"
cp run-server.sh "$DIST_DIR/"
cp run-server.bat "$DIST_DIR/"
cp README_INSTALL.txt "$DIST_DIR/"

# Create zip file
ZIP_NAME="${DIST_NAME}.zip"
echo "📦 Creating zip file: $ZIP_NAME"
cd "$DIST_DIR"
zip -r "../$ZIP_NAME" . -q
cd ..

# Cleanup
rm -rf "$DIST_DIR"

echo ""
echo "✅ Package created successfully!"
echo "📦 File: $ZIP_NAME"
echo ""
echo "You can now share this zip file with others."
echo "The recipient should extract it and run run-server.sh (Mac/Linux) or run-server.bat (Windows)"

