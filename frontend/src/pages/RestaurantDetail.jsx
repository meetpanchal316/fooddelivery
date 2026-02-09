import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, orderAPI } from '../services/api';

function RestaurantDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getRestaurantById(id),
        restaurantAPI.getMenu(id),
      ]);
      setRestaurant(restaurantRes.data);
      setMenu(menuRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load restaurant details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ]);
    }
    setSuccess('Item added to cart!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const removeFromCart = (menuItemId) => {
    setCart(cart.filter((item) => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setOrderLoading(true);
    try {
      const orderData = {
        userId: user.id,
        restaurantId: id,
        items: cart,
        deliveryAddress: user.address,
        paymentMethod: 'cash',
      };

      await orderAPI.createOrder(orderData);
      setSuccess('Order placed successfully!');
      setCart([]);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error && !restaurant) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">Restaurant not found</div>;

  return (
    <div>
      <div className="card">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <div style={{ marginTop: '1rem' }}>
          <strong>Cuisine:</strong> {restaurant.cuisine.join(', ')}
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Rating:</strong> ⭐ {restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Address:</strong> {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Phone:</strong> {restaurant.phone}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div>
          <h2>Menu</h2>
          {menu.length === 0 ? (
            <div className="card">No menu items available</div>
          ) : (
            <div className="card">
              {menu.map((item) => (
                <div key={item._id} className="menu-item">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="badge" style={{ backgroundColor: item.isVegetarian ? '#e8f5e9' : '#ffebee', color: item.isVegetarian ? '#2e7d32' : '#c62828' }}>
                        {item.isVegetarian ? '🥗 Vegetarian' : '🍖 Non-Veg'}
                      </span>
                      <span className="badge" style={{ marginLeft: '0.5rem' }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price">${item.price.toFixed(2)}</div>
                    {item.isAvailable ? (
                      <button onClick={() => addToCart(item)} style={{ marginTop: '0.5rem' }}>
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled style={{ marginTop: '0.5rem' }}>
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>Cart</h2>
          <div className="card">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.menuItemId} className="menu-item">
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem' }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          style={{ padding: '0.25rem 0.75rem', marginLeft: '0.5rem' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        style={{ marginTop: '0.5rem', backgroundColor: '#c62828' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                  <div className="flex-between">
                    <strong>Total:</strong>
                    <strong className="price" style={{ fontSize: '1.5rem' }}>
                      ${calculateTotal().toFixed(2)}
                    </strong>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  {orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
