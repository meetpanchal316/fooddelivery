import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    city: '',
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.city) params.city = filters.city;
      
      const response = await restaurantAPI.getAllRestaurants(params);
      setRestaurants(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    fetchRestaurants();
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Restaurants</h1>
      
      <div className="card">
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Cuisine:</label>
            <input
              type="text"
              name="cuisine"
              placeholder="e.g., Italian, Chinese, Indian"
              value={filters.cuisine}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>City:</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., New York"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </div>
          <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="card">
          <p>No restaurants found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="card">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
              <div style={{ marginTop: '1rem' }}>
                <strong>Cuisine:</strong> {restaurant.cuisine.join(', ')}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Rating:</strong> ⭐ {restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Location:</strong> {restaurant.address.city}, {restaurant.address.state}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Phone:</strong> {restaurant.phone}
              </div>
              <Link to={`/restaurants/${restaurant._id}`}>
                <button style={{ marginTop: '1rem', width: '100%' }}>
                  View Menu
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
