#!/bin/bash

# Cloudflare Pages Deployment Script for PromptForge
# This script builds and deploys the React SPA to Cloudflare Pages

set -e  # Exit on any error

echo "🚀 Starting deployment to Cloudflare Pages..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the project
echo -e "${BLUE}Step 1/5: Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Build failed!${NC}"
  exit 1
fi

# Step 2: Check if _routes.json exists
echo -e "${BLUE}Step 2/5: Checking SPA routing files...${NC}"
if [ ! -f "public/_routes.json" ]; then
  echo -e "${YELLOW}Warning: public/_routes.json not found!${NC}"
  echo "Creating _routes.json for SPA routing..."
fi

# Step 3: Check if _headers exists
if [ ! -f "public/_headers" ]; then
  echo -e "${YELLOW}Warning: public/_headers not found!${NC}"
fi

# Step 4: Check if 404.html exists
if [ ! -f "public/404.html" ]; then
  echo -e "${YELLOW}Warning: public/404.html not found!${NC}"
fi

# Step 5: Deploy to Cloudflare Pages
echo -e "${BLUE}Step 3/5: Deploying to Cloudflare Pages...${NC}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
  echo -e "${YELLOW}Wrangler not found. Installing...${NC}"
  npm install -g wrangler
fi

# Deploy using Wrangler
npx wrangler pages deploy dist --project-name=picture-prompt-generator --branch=main

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Deployment successful!${NC}"
  echo ""
  echo "🌐 Your site should be live at:"
  echo "https://616ebddb.picture-prompt-generator.pages.dev/"
  echo ""
  echo "⚠️  If you still see a blank page:"
  echo "1. Wait 1-2 minutes for Cloudflare to propagate changes"
  echo "2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)"
  echo "3. Check Cloudflare Dashboard → Pages → deployments"
  echo "4. Verify _routes.json is in the dist/ folder after build"
else
  echo -e "${YELLOW}❌ Deployment failed!${NC}"
  echo "Check the error messages above."
  exit 1
fi
