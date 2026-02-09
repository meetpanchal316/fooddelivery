const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'side_dish'],
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: String
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  cuisine: {
    type: [String],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  menu: [menuItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
