import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

function AdminOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const response = await orderAPI.getAllOrders(params);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      setSuccess('Order status updated successfully!');
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-${status}`;
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="card">
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <h1>Manage Orders</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>Filter by Status</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <p>No orders found.</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex-between">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p style={{ color: '#666' }}>Restaurant: {order.restaurantName}</p>
                  <p style={{ color: '#666' }}>Customer ID: {order.userId}</p>
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
                <br />
                <strong>Payment Status:</strong> {order.paymentStatus.toUpperCase()}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}
                <br />
                <strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}
              </div>

              {order.specialInstructions && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Special Instructions:</strong>
                  <p>{order.specialInstructions}</p>
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <strong>Update Status:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {order.status !== 'confirmed' && order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'preparing')}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', backgroundColor: '#2e7d32' }}
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', backgroundColor: '#c62828' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
