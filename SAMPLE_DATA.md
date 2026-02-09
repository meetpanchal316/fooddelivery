# Sample Data for Testing

This file contains sample data you can use to quickly populate your application.

## 1. Sample Users

### Admin User
```json
{
  "name": "Admin User",
  "email": "admin@fooddelivery.com",
  "password": "admin123",
  "phone": "555-0100",
  "address": {
    "street": "100 Admin St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "role": "admin"
}
```

### Regular Customer
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-0101",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "role": "customer"
}
```

### Restaurant Owner
```json
{
  "name": "Restaurant Owner",
  "email": "owner@restaurant.com",
  "password": "owner123",
  "phone": "555-0102",
  "address": {
    "street": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  },
  "role": "restaurant_owner"
}
```

## 2. Sample Restaurants

### Italian Restaurant
```json
{
  "name": "Bella Italia",
  "description": "Authentic Italian cuisine with fresh ingredients",
  "cuisine": ["Italian", "Pizza", "Pasta"],
  "phone": "555-0200",
  "email": "info@bellaitalia.com",
  "address": {
    "street": "789 Food Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10003"
  },
  "rating": 4.5,
  "totalReviews": 120
}
```

### Chinese Restaurant
```json
{
  "name": "Golden Dragon",
  "description": "Traditional Chinese dishes and modern fusion",
  "cuisine": ["Chinese", "Asian", "Noodles"],
  "phone": "555-0201",
  "email": "info@goldendragon.com",
  "address": {
    "street": "321 Taste Avenue",
    "city": "New York",
    "state": "NY",
    "zipCode": "10004"
  },
  "rating": 4.7,
  "totalReviews": 200
}
```

### Indian Restaurant
```json
{
  "name": "Spice Garden",
  "description": "Aromatic Indian spices and traditional recipes",
  "cuisine": ["Indian", "Curry", "Vegetarian"],
  "phone": "555-0202",
  "email": "info@spicegarden.com",
  "address": {
    "street": "567 Flavor Road",
    "city": "New York",
    "state": "NY",
    "zipCode": "10005"
  },
  "rating": 4.6,
  "totalReviews": 150
}
```

### Burger Joint
```json
{
  "name": "Burger Heaven",
  "description": "Juicy burgers and crispy fries",
  "cuisine": ["American", "Burgers", "Fast Food"],
  "phone": "555-0203",
  "email": "info@burgerheaven.com",
  "address": {
    "street": "890 Grill Lane",
    "city": "New York",
    "state": "NY",
    "zipCode": "10006"
  },
  "rating": 4.3,
  "totalReviews": 180
}
```

### Sushi Bar
```json
{
  "name": "Sushi Master",
  "description": "Fresh sushi and Japanese specialties",
  "cuisine": ["Japanese", "Sushi", "Asian"],
  "phone": "555-0204",
  "email": "info@sushimaster.com",
  "address": {
    "street": "234 Ocean View",
    "city": "New York",
    "state": "NY",
    "zipCode": "10007"
  },
  "rating": 4.8,
  "totalReviews": 250
}
```

## 3. Sample Menu Items

### For Italian Restaurant (Bella Italia)

**Margherita Pizza**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato, mozzarella, and basil",
  "price": 12.99,
  "category": "main_course",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Pepperoni Pizza**
```json
{
  "name": "Pepperoni Pizza",
  "description": "Pizza topped with spicy pepperoni slices",
  "price": 14.99,
  "category": "main_course",
  "isVegetarian": false,
  "isAvailable": true
}
```

**Spaghetti Carbonara**
```json
{
  "name": "Spaghetti Carbonara",
  "description": "Creamy pasta with bacon and parmesan",
  "price": 15.99,
  "category": "main_course",
  "isVegetarian": false,
  "isAvailable": true
}
```

**Caesar Salad**
```json
{
  "name": "Caesar Salad",
  "description": "Fresh romaine with Caesar dressing and croutons",
  "price": 8.99,
  "category": "appetizer",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Tiramisu**
```json
{
  "name": "Tiramisu",
  "description": "Classic Italian dessert with coffee and mascarpone",
  "price": 6.99,
  "category": "dessert",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Italian Soda**
```json
{
  "name": "Italian Soda",
  "description": "Sparkling water with fruit syrup",
  "price": 3.99,
  "category": "beverage",
  "isVegetarian": true,
  "isAvailable": true
}
```

### For Chinese Restaurant (Golden Dragon)

**Kung Pao Chicken**
```json
{
  "name": "Kung Pao Chicken",
  "description": "Spicy stir-fried chicken with peanuts and vegetables",
  "price": 13.99,
  "category": "main_course",
  "isVegetarian": false,
  "isAvailable": true
}
```

**Vegetable Fried Rice**
```json
{
  "name": "Vegetable Fried Rice",
  "description": "Wok-fried rice with mixed vegetables and egg",
  "price": 10.99,
  "category": "main_course",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Spring Rolls**
```json
{
  "name": "Spring Rolls",
  "description": "Crispy vegetable spring rolls with sweet chili sauce",
  "price": 6.99,
  "category": "appetizer",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Sweet and Sour Pork**
```json
{
  "name": "Sweet and Sour Pork",
  "description": "Crispy pork with sweet and sour sauce",
  "price": 14.99,
  "category": "main_course",
  "isVegetarian": false,
  "isAvailable": true
}
```

### For Indian Restaurant (Spice Garden)

**Chicken Tikka Masala**
```json
{
  "name": "Chicken Tikka Masala",
  "description": "Tender chicken in creamy tomato sauce",
  "price": 15.99,
  "category": "main_course",
  "isVegetarian": false,
  "isAvailable": true
}
```

**Palak Paneer**
```json
{
  "name": "Palak Paneer",
  "description": "Cottage cheese cubes in spinach curry",
  "price": 13.99,
  "category": "main_course",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Samosas**
```json
{
  "name": "Samosas",
  "description": "Crispy pastries filled with spiced potatoes",
  "price": 5.99,
  "category": "appetizer",
  "isVegetarian": true,
  "isAvailable": true
}
```

**Garlic Naan**
```json
{
  "name": "Garlic Naan",
  "description": "Soft flatbread with garlic and butter",
  "price": 3.99,
  "category": "side_dish",
  "isVegetarian": true,
  "isAvailable": true
}
```

## 4. cURL Commands for Quick Setup

### Register Admin User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@fooddelivery.com",
    "password": "admin123",
    "phone": "555-0100",
    "address": {
      "street": "100 Admin St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "role": "admin"
  }'
```

### Create Italian Restaurant
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bella Italia",
    "description": "Authentic Italian cuisine with fresh ingredients",
    "cuisine": ["Italian", "Pizza", "Pasta"],
    "phone": "555-0200",
    "email": "info@bellaitalia.com",
    "address": {
      "street": "789 Food Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10003"
    }
  }'
```

### Add Menu Item (Replace RESTAURANT_ID)
```bash
curl -X POST http://localhost:3000/api/restaurants/RESTAURANT_ID/menu \
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

## 5. Testing Order Flow

1. **Register a user** (use the registration endpoint above)
2. **Create restaurants** (use the restaurant creation endpoint)
3. **Add menu items** to restaurants
4. **Login to get user ID** from the response
5. **Create an order:**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "restaurantId": "RESTAURANT_ID_HERE",
    "items": [
      {
        "menuItemId": "MENU_ITEM_ID_HERE",
        "quantity": 2
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "paymentMethod": "cash"
  }'
```

6. **Update order status:**

```bash
curl -X PUT http://localhost:3000/api/orders/ORDER_ID_HERE/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

## 6. Quick Test Script

Save this as `populate-data.sh` and run it after all services are running:

```bash
#!/bin/bash

# Register admin user
echo "Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@fooddelivery.com",
    "password": "admin123",
    "phone": "555-0100",
    "address": {
      "street": "100 Admin St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "role": "admin"
  }')

echo "Admin created!"

# Create restaurant
echo "Creating restaurant..."
RESTAURANT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bella Italia",
    "description": "Authentic Italian cuisine",
    "cuisine": ["Italian", "Pizza", "Pasta"],
    "phone": "555-0200",
    "email": "info@bellaitalia.com",
    "address": {
      "street": "789 Food Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10003"
    }
  }')

echo "Restaurant created!"
echo "You can now login with: admin@fooddelivery.com / admin123"
```

Make it executable: `chmod +x populate-data.sh`
Run it: `./populate-data.sh`
