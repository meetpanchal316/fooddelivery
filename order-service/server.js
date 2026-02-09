const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const Order = require('./models/Order');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// ---- SAFETY CHECKS ----
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not defined in .env');
  process.exit(1);
}

// ---- CONNECT TO MONGODB ----
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Order Service: Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- HEALTH CHECK ----
app.get('/health', (req, res) => {
  res.json({
    service: 'order-service',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ---- CREATE ORDER ----
app.post('/api/orders', async (req, res) => {
  try {
    const {
      userId,
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
    } = req.body;

    // ---- VALIDATE IDS ----
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return res.status(400).json({ error: 'Invalid userId or restaurantId' });
    }

    // ---- VERIFY USER ----
    try {
      await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    } catch {
      return res.status(404).json({ error: 'User not found' });
    }

    // ---- VERIFY RESTAURANT ----
    let restaurant;
    try {
      const response = await axios.get(
        `${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`
      );
      restaurant = response.data;
    } catch {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // ---- CALCULATE TOTAL ----
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const menuItem = restaurant.menu.find(
        (m) => m._id.toString() === item.menuItemId
      );

      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const order = new Order({
      userId,
      restaurantId,
      restaurantName: restaurant.name,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
    });

    await order.save(); // 🔥 CREATES DB & COLLECTION

    console.log('✅ Order created:', order._id.toString());

    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// ---- GET ALL ORDERS ----
app.get('/api/orders', async (req, res) => {
  try {
    const { status, userId, restaurantId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.userId = userId;
    if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
      filter.restaurantId = restaurantId;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Fetch orders error:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// ---- GET ORDER BY ID ----
app.get('/api/orders/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('❌ Fetch order error:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// ---- GET ORDERS BY USER ----
app.get('/api/orders/user/:userId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error('❌ Fetch user orders error:', error);
    res.status(500).json({ error: 'Error fetching user orders' });
  }
});

// ---- UPDATE ORDER STATUS ----
app.put('/api/orders/:id/status', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const { status } = req.body;
    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

// ---- UPDATE ORDER ----
app.put('/api/orders/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({ error: 'Error updating order' });
  }
});

// ---- CANCEL ORDER ----
app.delete('/api/orders/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res
        .status(400)
        .json({ error: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({ error: 'Error cancelling order' });
  }
});

// ---- START SERVER ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});
