const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Notification = require('./models/Notification');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI;

// ---- SAFETY CHECK ----
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not defined in .env');
  process.exit(1);
}

// ---- CONNECT TO MONGODB ----
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Notification Service: Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- HEALTH CHECK ----
app.get('/health', (req, res) => {
  res.json({
    service: 'notification-service',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ---- CREATE NOTIFICATION ----
app.post('/api/notifications', async (req, res) => {
  try {
    const { userId, orderId, message, type } = req.body;

    // ---- VALIDATE IDS ----
    if (
      (userId && !mongoose.Types.ObjectId.isValid(userId)) ||
      (orderId && !mongoose.Types.ObjectId.isValid(orderId))
    ) {
      return res.status(400).json({ error: 'Invalid userId or orderId' });
    }

    const notification = new Notification({
      userId,
      orderId,
      message,
      type: type || 'order_placed',
    });

    await notification.save(); // 🔥 CREATES DB & COLLECTION

    console.log(`✅ Notification created for user ${userId}: ${message}`);

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error('❌ Create notification error:', error);
    res.status(500).json({ error: 'Error creating notification' });
  }
});

// ---- GET NOTIFICATIONS FOR USER ----
app.get('/api/notifications/user/:userId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const { isRead } = req.query;
    const filter = { userId: req.params.userId };

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    console.error('❌ Fetch notifications error:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// ---- GET NOTIFICATION BY ID ----
app.get('/api/notifications/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error('❌ Fetch notification error:', error);
    res.status(500).json({ error: 'Error fetching notification' });
  }
});

// ---- MARK NOTIFICATION AS READ ----
app.put('/api/notifications/:id/read', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('❌ Update notification error:', error);
    res.status(500).json({ error: 'Error updating notification' });
  }
});

// ---- MARK ALL AS READ FOR USER ----
app.put('/api/notifications/user/:userId/read-all', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    await Notification.updateMany(
      { userId: req.params.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('❌ Read-all notifications error:', error);
    res.status(500).json({ error: 'Error updating notifications' });
  }
});

// ---- DELETE NOTIFICATION ----
app.delete('/api/notifications/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('❌ Delete notification error:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
});

// ---- DELETE ALL NOTIFICATIONS FOR USER ----
app.delete('/api/notifications/user/:userId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    await Notification.deleteMany({ userId: req.params.userId });
    res.json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user notifications error:', error);
    res.status(500).json({ error: 'Error deleting notifications' });
  }
});

// ---- START SERVER ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});
