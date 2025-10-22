#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Swiss Pairing System - Deployment Tool       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed${NC}"

if ! command_exists npm; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm installed${NC}"

if ! command_exists vercel; then
    echo -e "${YELLOW}⚠ Vercel CLI is not installed${NC}"
    echo -e "${YELLOW}Install it with: npm install -g vercel${NC}"
    read -p "Do you want to continue without Vercel CLI? (y/n): " continue
    if [[ $continue != "y" ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Select deployment type:${NC}"
echo "1) Development (Local)"
echo "2) Production (Vercel - Backend)"
echo "3) Production (Vercel - Frontend)"
echo "4) Production (Vercel - Both)"
echo "5) Test Build (Local)"
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "${GREEN}Starting development environment...${NC}"
        echo ""
        
        # Check MongoDB
        if command_exists mongod; then
            echo -e "${GREEN}✓ MongoDB installed${NC}"
        else
            echo -e "${YELLOW}⚠ MongoDB not found. Make sure it's running.${NC}"
        fi
        
        # Start backend
        echo -e "${YELLOW}Starting backend on port 5001...${NC}"
        cd backend
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}Installing backend dependencies...${NC}"
            npm install
        fi
        
        # Check if .env exists
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}Creating .env file from .env.development...${NC}"
            cp .env.development .env
        fi
        
        osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run dev"'
        cd ..
        
        # Start frontend
        echo -e "${YELLOW}Starting frontend on port 3000...${NC}"
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}Installing frontend dependencies...${NC}"
            npm install
        fi
        
        sleep 2
        osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm start"'
        cd ..
        
        echo ""
        echo -e "${GREEN}✓ Development environment started!${NC}"
        echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
        echo -e "${BLUE}Backend: http://localhost:5001${NC}"
        ;;
        
    2)
        echo -e "${GREEN}Deploying backend to Vercel...${NC}"
        echo ""
        
        if ! command_exists vercel; then
            echo -e "${RED}✗ Vercel CLI is required for this option${NC}"
            echo -e "${YELLOW}Install it with: npm install -g vercel${NC}"
            exit 1
        fi
        
        cd backend
        
        echo -e "${YELLOW}Make sure you have set these environment variables in Vercel:${NC}"
        echo "  - NODE_ENV=production"
        echo "  - MONGODB_URI=<your-mongodb-atlas-url>"
        echo "  - FRONTEND_URL=<your-frontend-vercel-url>"
        echo ""
        read -p "Press enter to continue..."
        
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✓ Backend deployed!${NC}"
        echo -e "${YELLOW}Don't forget to update FRONTEND_URL after frontend deployment${NC}"
        cd ..
        ;;
        
    3)
        echo -e "${GREEN}Deploying frontend to Vercel...${NC}"
        echo ""
        
        if ! command_exists vercel; then
            echo -e "${RED}✗ Vercel CLI is required for this option${NC}"
            echo -e "${YELLOW}Install it with: npm install -g vercel${NC}"
            exit 1
        fi
        
        cd frontend
        
        echo -e "${YELLOW}Make sure you have set these environment variables in Vercel:${NC}"
        echo "  - REACT_APP_API_URL=<your-backend-vercel-url>/api"
        echo "  - REACT_APP_ENV=production"
        echo ""
        read -p "Press enter to continue..."
        
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✓ Frontend deployed!${NC}"
        echo -e "${YELLOW}Don't forget to update backend FRONTEND_URL with this URL${NC}"
        cd ..
        ;;
        
    4)
        echo -e "${GREEN}Deploying both backend and frontend to Vercel...${NC}"
        echo ""
        
        if ! command_exists vercel; then
            echo -e "${RED}✗ Vercel CLI is required for this option${NC}"
            echo -e "${YELLOW}Install it with: npm install -g vercel${NC}"
            exit 1
        fi
        
        # Deploy backend first
        echo -e "${BLUE}Step 1: Deploying backend...${NC}"
        cd backend
        vercel --prod
        echo ""
        read -p "Enter your backend URL (from above): " backend_url
        cd ..
        
        # Deploy frontend
        echo ""
        echo -e "${BLUE}Step 2: Deploying frontend...${NC}"
        cd frontend
        vercel --prod
        echo ""
        read -p "Enter your frontend URL (from above): " frontend_url
        cd ..
        
        echo ""
        echo -e "${GREEN}✓ Both services deployed!${NC}"
        echo ""
        echo -e "${YELLOW}IMPORTANT: Update environment variables in Vercel Dashboard:${NC}"
        echo -e "${BLUE}Backend:${NC}"
        echo "  - FRONTEND_URL=$frontend_url"
        echo ""
        echo -e "${BLUE}Frontend:${NC}"
        echo "  - REACT_APP_API_URL=$backend_url/api"
        echo ""
        echo -e "${YELLOW}After updating, redeploy both services.${NC}"
        ;;
        
    5)
        echo -e "${GREEN}Building for production (local test)...${NC}"
        echo ""
        
        # Build frontend
        echo -e "${YELLOW}Building frontend...${NC}"
        cd frontend
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        npm run build:prod
        cd ..
        
        echo ""
        echo -e "${GREEN}✓ Build completed!${NC}"
        echo -e "${BLUE}Frontend build is in: frontend/build/${NC}"
        echo ""
        echo -e "${YELLOW}To test the production build locally:${NC}"
        echo "  cd frontend/build"
        echo "  npx serve -s ."
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done! 🚀${NC}"
