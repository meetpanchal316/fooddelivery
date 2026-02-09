import axios from 'axios';

const API_GATEWAY_URL = '';

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Service APIs
export const userAPI = {
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
};

// Restaurant Service APIs
export const restaurantAPI = {
  createRestaurant: (restaurantData) => api.post('/api/restaurants', restaurantData),
  getAllRestaurants: (params) => api.get('/api/restaurants', { params }),
  getRestaurantById: (id) => api.get(`/api/restaurants/${id}`),
  updateRestaurant: (id, data) => api.put(`/api/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/api/restaurants/${id}`),
  addMenuItem: (restaurantId, menuItem) => api.post(`/api/restaurants/${restaurantId}/menu`, menuItem),
  getMenu: (restaurantId, params) => api.get(`/api/restaurants/${restaurantId}/menu`, { params }),
};

// Order Service APIs
export const orderAPI = {
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getAllOrders: (params) => api.get('/api/orders', { params }),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  getUserOrders: (userId) => api.get(`/api/orders/user/${userId}`),
  updateOrderStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

// Notification Service APIs
export const notificationAPI = {
  getUserNotifications: (userId, params) => api.get(`/api/notifications/user/${userId}`, { params }),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/api/notifications/user/${userId}/read-all`),
};

export default api;
