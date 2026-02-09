import { useState, useEffect } from 'react';
import { orderAPI, notificationAPI } from '../services/api';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchNotifications();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders(user.id);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getUserNotifications(user.id);
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderAPI.updateOrderStatus(orderId, 'cancelled');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order: ' + (err.response?.data?.error || err.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-${status}`;
  };

  if (!user) {
    return (
      <div className="card">
        <p>Please login to view your orders.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>My Orders</h1>

      {notifications.length > 0 && (
        <div className="card" style={{ backgroundColor: '#e3f2fd' }}>
          <h3>🔔 Recent Notifications</h3>
          {notifications.slice(0, 5).map((notif) => (
            <div key={notif._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
              <p style={{ margin: 0 }}>{notif.message}</p>
              <small style={{ color: '#666' }}>
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card">
          <p>You haven't placed any orders yet.</p>
          <a href="/restaurants">
            <button>Browse Restaurants</button>
          </a>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex-between">
                <div>
                  <h3>{order.restaurantName}</h3>
                  <p style={{ color: '#666' }}>Order ID: {order._id}</p>
                </div>
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex-between" style={{ marginTop: '0.5rem' }}>
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                <div className="flex-between">
                  <strong>Total Amount:</strong>
                  <strong className="price" style={{ fontSize: '1.25rem' }}>
                    ${order.totalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>Delivery Address:</strong>
                <p>
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                  {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}
              </div>

              {order.estimatedDeliveryTime && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Estimated Delivery:</strong>{' '}
                  {new Date(order.estimatedDeliveryTime).toLocaleString()}
                </div>
              )}

              {order.specialInstructions && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Special Instructions:</strong>
                  <p>{order.specialInstructions}</p>
                </div>
              )}

              {order.status === 'pending' || order.status === 'confirmed' ? (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  style={{ marginTop: '1rem', backgroundColor: '#c62828' }}
                >
                  Cancel Order
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
