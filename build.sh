#!/bin/bash
set -e

echo "🔨 Starting Vercel build process..."
echo "Step 1: Installing dependencies..."
npm install --legacy-peer-deps

echo "Step 2: Building client..."
npm run build:client

echo "✅ Build completed successfully!"
ls -lah dist/public/
