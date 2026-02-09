#!/bin/bash

echo "🚀 Setting up Food Delivery Microservices Platform..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

if ! command_exists mongod; then
    echo -e "${RED}⚠️  MongoDB is not installed. Please install MongoDB v5.0 or higher.${NC}"
    echo "   You can continue, but the services won't work without MongoDB."
fi

echo -e "${GREEN}✅ Prerequisites check complete${NC}"
echo ""

# Install dependencies for all services
services=("api-gateway" "user-service" "restaurant-service" "order-service" "notification-service" "frontend")

for service in "${services[@]}"; do
    echo -e "${BLUE}📦 Installing dependencies for $service...${NC}"
    cd "$service" || exit
    npm install --silent
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $service dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies for $service${NC}"
        exit 1
    fi
    cd ..
    echo ""
done

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📖 Next steps:"
echo "1. Make sure MongoDB is running: mongosh"
echo "2. Start each service in a separate terminal:"
echo ""
echo "   Terminal 1: cd api-gateway && npm start"
echo "   Terminal 2: cd user-service && npm start"
echo "   Terminal 3: cd restaurant-service && npm start"
echo "   Terminal 4: cd order-service && npm start"
echo "   Terminal 5: cd notification-service && npm start"
echo "   Terminal 6: cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md"
