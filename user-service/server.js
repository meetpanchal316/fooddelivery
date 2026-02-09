const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

// ---- SAFETY CHECK ----
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not defined in .env');
  process.exit(1);
}

// ---- CONNECT TO MONGODB ----
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ User Service: Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- HEALTH CHECK ----
app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ---- REGISTER USER ----
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'customer',
    });

    await user.save(); // 🔥 THIS CREATES DB & COLLECTION

    console.log('✅ User saved:', user._id.toString());

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// ---- LOGIN USER ----
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// ---- GET ALL USERS ----
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Fetch users error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// ---- GET USER BY ID ----
app.get('/api/users/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Fetch user error:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// ---- UPDATE USER ----
app.put('/api/users/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// ---- DELETE USER ----
app.delete('/api/users/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// ---- START SERVER ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});
