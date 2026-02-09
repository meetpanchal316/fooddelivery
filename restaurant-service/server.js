const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Restaurant = require('./models/Restaurant');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI;

// ---- SAFETY CHECK ----
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not defined in .env');
  process.exit(1);
}

// ---- CONNECT TO MONGODB ----
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Restaurant Service: Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- HEALTH CHECK ----
app.get('/health', (req, res) => {
  res.json({
    service: 'restaurant-service',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ---- CREATE RESTAURANT ----
app.post('/api/restaurants', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save(); // 🔥 creates DB & collection
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    console.error('❌ Create restaurant error:', error);
    res.status(500).json({ error: 'Error creating restaurant' });
  }
});

// ---- GET ALL RESTAURANTS ----
app.get('/api/restaurants', async (req, res) => {
  try {
    const { cuisine, city, isActive } = req.query;
    const filter = {};

    if (cuisine) filter.cuisine = { $in: [cuisine] };
    if (city) filter['address.city'] = city;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const restaurants = await Restaurant.find(filter);
    res.json(restaurants);
  } catch (error) {
    console.error('❌ Fetch restaurants error:', error);
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
});

// ---- GET RESTAURANT BY ID ----
app.get('/api/restaurants/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('❌ Fetch restaurant error:', error);
    res.status(500).json({ error: 'Error fetching restaurant' });
  }
});

// ---- UPDATE RESTAURANT ----
app.put('/api/restaurants/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    console.error('❌ Update restaurant error:', error);
    res.status(500).json({ error: 'Error updating restaurant' });
  }
});

// ---- DELETE RESTAURANT ----
app.delete('/api/restaurants/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.paramsid)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('❌ Delete restaurant error:', error);
    res.status(500).json({ error: 'Error deleting restaurant' });
  }
});

// ---- ADD MENU ITEM ----
app.post('/api/restaurants/:restaurantId/menu', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.menu.push(req.body);
    await restaurant.save();

    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem: restaurant.menu[restaurant.menu.length - 1],
    });
  } catch (error) {
    console.error('❌ Add menu item error:', error);
    res.status(500).json({ error: 'Error adding menu item' });
  }
});

// ---- GET MENU ----
app.get('/api/restaurants/:restaurantId/menu', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let menu = restaurant.menu;
    const { category, isVegetarian, isAvailable } = req.query;

    if (category) menu = menu.filter(item => item.category === category);
    if (isVegetarian !== undefined) menu = menu.filter(item => item.isVegetarian === (isVegetarian === 'true'));
    if (isAvailable !== undefined) menu = menu.filter(item => item.isAvailable === (isAvailable === 'true'));

    res.json(menu);
  } catch (error) {
    console.error('❌ Fetch menu error:', error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
});

// ---- UPDATE MENU ITEM ----
app.put('/api/restaurants/:restaurantId/menu/:menuItemId', async (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.restaurantId) ||
    !mongoose.Types.ObjectId.isValid(req.params.menuItemId)
  ) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItem = restaurant.menu.id(req.params.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    Object.assign(menuItem, req.body);
    await restaurant.save();

    res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
    console.error('❌ Update menu item error:', error);
    res.status(500).json({ error: 'Error updating menu item' });
  }
});

// ---- DELETE MENU ITEM ----
app.delete('/api/restaurants/:restaurantId/menu/:menuItemId', async (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.restaurantId) ||
    !mongoose.Types.ObjectId.isValid(req.params.menuItemId)
  ) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.menu.pull(req.params.menuItemId);
    await restaurant.save();

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('❌ Delete menu item error:', error);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

// ---- START SERVER ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Restaurant Service running on port ${PORT}`);
});
