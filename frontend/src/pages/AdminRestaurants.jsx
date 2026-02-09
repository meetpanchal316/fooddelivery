import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';

function AdminRestaurants({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchRestaurants();
    }
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAllRestaurants();
      setRestaurants(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (name === 'cuisine') {
      setFormData({
        ...formData,
        [name]: value.split(',').map(c => c.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cuisine: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await restaurantAPI.updateRestaurant(editingId, formData);
        setSuccess('Restaurant updated successfully!');
      } else {
        await restaurantAPI.createRestaurant(formData);
        setSuccess('Restaurant created successfully!');
      }
      fetchRestaurants();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine.join(', '),
      phone: restaurant.phone,
      email: restaurant.email || '',
      address: restaurant.address,
    });
    setEditingId(restaurant._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      await restaurantAPI.deleteRestaurant(id);
      setSuccess('Restaurant deleted successfully!');
      fetchRestaurants();
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="card">
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="flex-between">
        <h1>Manage Restaurants</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Restaurant'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Cuisine (comma-separated):</label>
              <input
                type="text"
                name="cuisine"
                placeholder="e.g., Italian, Pizza, Pasta"
                value={formData.cuisine}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <h3>Address</h3>
            <div className="form-group">
              <label>Street:</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Zip Code:</label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </div>
            <button type="submit">{editingId ? 'Update' : 'Create'} Restaurant</button>
          </form>
        </div>
      )}

      <h2>All Restaurants</h2>
      <div className="grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Cuisine:</strong> {restaurant.cuisine.join(', ')}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Phone:</strong> {restaurant.phone}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Location:</strong> {restaurant.address.city}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => handleEdit(restaurant)}>Edit</button>
              <button
                onClick={() => handleDelete(restaurant._id)}
                style={{ backgroundColor: '#c62828' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRestaurants;
