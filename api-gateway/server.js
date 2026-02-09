const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running', timestamp: new Date() });
});

// User Service Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/users/register`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/users/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

// Restaurant Service Routes
app.post('/api/restaurants', async (req, res) => {
  try {
    const response = await axios.post(`${RESTAURANT_SERVICE_URL}/api/restaurants`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const response = await axios.put(`${RESTAURANT_SERVICE_URL}/api/restaurants/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${RESTAURANT_SERVICE_URL}/api/restaurants/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

// Menu Item Routes
app.post('/api/restaurants/:restaurantId/menu', async (req, res) => {
  try {
    const response = await axios.post(`${RESTAURANT_SERVICE_URL}/api/restaurants/${req.params.restaurantId}/menu`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/restaurants/:restaurantId/menu', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${req.params.restaurantId}/menu`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

// Order Service Routes
app.post('/api/orders', async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE_URL}/api/orders`, req.body);
    
    // Trigger notification service
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId: req.body.userId,
        orderId: response.data._id,
        message: `Order placed successfully! Order ID: ${response.data._id}`
      });
    } catch (notifError) {
      console.error('Notification service error:', notifError.message);
    }
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/user/${req.params.userId}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const response = await axios.put(`${ORDER_SERVICE_URL}/api/orders/${req.params.id}/status`, req.body);
    
    // Trigger notification for status update
    try {
      const order = response.data;
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId: order.userId,
        orderId: order._id,
        message: `Order status updated to: ${order.status}`
      });
    } catch (notifError) {
      console.error('Notification service error:', notifError.message);
    }
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

// Notification Service Routes
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const response = await axios.get(`${NOTIFICATION_SERVICE_URL}/api/notifications/user/${req.params.userId}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Routing to:`);
  console.log(`- User Service: ${USER_SERVICE_URL}`);
  console.log(`- Restaurant Service: ${RESTAURANT_SERVICE_URL}`);
  console.log(`- Order Service: ${ORDER_SERVICE_URL}`);
  console.log(`- Notification Service: ${NOTIFICATION_SERVICE_URL}`);
});
