# Food Delivery Microservices Platform

A complete microservices-based food delivery platform built with Node.js, Express, MongoDB, and React.

## 🏗️ Architecture

This project demonstrates a microservices architecture with the following services:

1. **API Gateway** (Port 3000) - Routes requests to appropriate microservices
2. **User Service** (Port 3001) - User authentication and management
3. **Restaurant Service** (Port 3002) - Restaurant and menu management
4. **Order Service** (Port 3003) - Order processing and tracking
5. **Notification Service** (Port 3004) - Order notifications
6. **Frontend** (Port 5173) - React UI with Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Install MongoDB

Make sure MongoDB is installed and running on your machine.

**Start MongoDB:**
```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

**Verify MongoDB is running:**
```bash
mongosh
```

### 2. Clone and Setup Project

```bash
# Navigate to the project directory
cd food-delivery-microservices
```

### 3. Install Dependencies for All Services

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
npm install
```

**Terminal 2 - User Service:**
```bash
cd user-service
npm install
```

**Terminal 3 - Restaurant Service:**
```bash
cd restaurant-service
npm install
```

**Terminal 4 - Order Service:**
```bash
cd order-service
npm install
```

**Terminal 5 - Notification Service:**
```bash
cd notification-service
npm install
```

**Terminal 6 - Frontend:**
```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Each service has a `.env` file already created with default values. You can modify them if needed:

- `api-gateway/.env` - API Gateway configuration
- `user-service/.env` - User service + MongoDB URI
- `restaurant-service/.env` - Restaurant service + MongoDB URI
- `order-service/.env` - Order service + MongoDB URI
- `notification-service/.env` - Notification service + MongoDB URI
- `frontend/.env` - Frontend API Gateway URL

**Important:** If you're using MongoDB Atlas or a different MongoDB URI, update the `MONGODB_URI` in each service's `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

### 5. Start All Services

You need to run each service in a separate terminal window:

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
npm start
```

**Terminal 2 - User Service:**
```bash
cd user-service
npm start
```

**Terminal 3 - Restaurant Service:**
```bash
cd restaurant-service
npm start
```

**Terminal 4 - Order Service:**
```bash
cd order-service
npm start
```

**Terminal 5 - Notification Service:**
```bash
cd notification-service
npm start
```

**Terminal 6 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

Once all services are running:

- **Frontend UI:** http://localhost:5173
- **API Gateway:** http://localhost:3000
- **User Service:** http://localhost:3001
- **Restaurant Service:** http://localhost:3002
- **Order Service:** http://localhost:3003
- **Notification Service:** http://localhost:3004

## 📱 Using the Application

### Step 1: Register a User

1. Go to http://localhost:5173
2. Click on "Register"
3. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Password: yourpassword
   - Phone: Your phone number
   - Role: Select "Admin" (to access admin features) or "Customer"
   - Address: Fill in your address details
4. Click "Register"

### Step 2: Create Restaurants (Admin Only)

1. Login with an admin account
2. Navigate to "Manage Restaurants" in the navigation
3. Click "Add New Restaurant"
4. Fill in restaurant details:
   - Name: Restaurant name
   - Description: Brief description
   - Cuisine: Comma-separated (e.g., "Italian, Pizza, Pasta")
   - Phone: Restaurant phone
   - Email: Restaurant email
   - Address: Full address
5. Click "Create Restaurant"

### Step 3: Add Menu Items

You can add menu items programmatically or through the API. Here's how to do it via API:

**Using cURL or Postman:**
```bash
curl -X POST http://localhost:3000/api/restaurants/{RESTAURANT_ID}/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato, mozzarella, and basil",
    "price": 12.99,
    "category": "main_course",
    "isVegetarian": true,
    "isAvailable": true
  }'
```

Replace `{RESTAURANT_ID}` with the actual restaurant ID from the previous step.

### Step 4: Browse and Order

1. Navigate to "Restaurants"
2. Click on a restaurant to view its menu
3. Add items to cart
4. Click "Place Order"
5. View your orders in "My Orders"

### Step 5: Manage Orders (Admin Only)

1. Navigate to "Manage Orders"
2. Update order status as needed
3. View all orders across the platform

## 🔄 API Endpoints

### User Service
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Restaurant Service
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `POST /api/restaurants/:id/menu` - Add menu item
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Order Service
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

### Notification Service
- `POST /api/notifications` - Create notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🗄️ Database Structure

Each service has its own MongoDB database:

- `user-service` - Users collection
- `restaurant-service` - Restaurants collection (with embedded menu items)
- `order-service` - Orders collection
- `notification-service` - Notifications collection

## 🧪 Testing the Microservices

### Health Check Endpoints

Test if all services are running:

```bash
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Restaurant Service
curl http://localhost:3003/health  # Order Service
curl http://localhost:3004/health  # Notification Service
```

### Sample API Requests

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

**Create a restaurant:**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "cuisine": ["Italian", "Pizza"],
    "phone": "555-0123",
    "email": "info@pizzapalace.com",
    "address": {
      "street": "456 Food St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    }
  }'
```

## 🛠️ Development Mode

For development with auto-reload, use `npm run dev` instead of `npm start`:

```bash
cd user-service
npm run dev
```

## 📊 Service Communication Flow

```
Frontend (React)
    ↓
API Gateway (Port 3000)
    ↓
    ├→ User Service (Port 3001) → MongoDB (user-service DB)
    ├→ Restaurant Service (Port 3002) → MongoDB (restaurant-service DB)
    ├→ Order Service (Port 3003) → MongoDB (order-service DB)
    │   ├→ Calls Restaurant Service (verify restaurant exists)
    │   └→ Calls User Service (verify user exists)
    └→ Notification Service (Port 3004) → MongoDB (notification-service DB)
```

## 🚫 Common Issues and Solutions

### MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`
**Solution:** Make sure MongoDB is running:
```bash
# Check MongoDB status
mongosh

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`
**Solution:** Kill the process using that port:
```bash
# Find process
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Service Can't Connect to Another Service
**Error:** API Gateway can't reach User Service
**Solution:** 
1. Make sure all services are running
2. Check the service URLs in `.env` files
3. Verify there are no firewall blocking local connections

## 🎯 Next Steps for DevOps

Now that you have the application running locally, you can:

1. **Containerize with Docker:**
   - Create Dockerfile for each service
   - Create docker-compose.yml for local development
   - Build and push images to Docker Hub

2. **Deploy to Kubernetes:**
   - Create Kubernetes manifests (Deployments, Services, ConfigMaps)
   - Deploy to GKE or local Minikube
   - Set up Ingress for routing

3. **Add CI/CD:**
   - Create GitHub Actions or GitLab CI pipelines
   - Automate testing and deployment
   - Implement rolling updates

4. **Infrastructure as Code:**
   - Use Terraform to provision GKE cluster
   - Manage cloud resources as code
   - Version control your infrastructure

5. **Monitoring & Logging:**
   - Add Prometheus for metrics
   - Set up Grafana dashboards
   - Implement ELK stack for logging

## 📝 Project Structure

```
food-delivery-microservices/
├── api-gateway/
│   ├── server.js
│   ├── package.json
│   └── .env
├── user-service/
│   ├── models/
│   │   └── User.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── restaurant-service/
│   ├── models/
│   │   └── Restaurant.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── order-service/
│   ├── models/
│   │   └── Order.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── notification-service/
│   ├── models/
│   │   └── Notification.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🤝 Contributing

This is a learning project for DevOps practices. Feel free to:
- Add new features
- Improve error handling
- Enhance security
- Add tests
- Improve documentation

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

Built as a microservices learning project for DevOps engineers focusing on containerization, orchestration, and cloud deployment.

---

**Happy Learning! 🚀**
