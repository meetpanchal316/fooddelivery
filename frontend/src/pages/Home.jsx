import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div>
      <h1>Welcome to Food Delivery Platform</h1>
      {user ? (
        <div className="user-info">
          <h3>Hello, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <div className="card">
          <p>Please login or register to start ordering food!</p>
        </div>
      )}

      <div className="card">
        <h2>About This Platform</h2>
        <p>This is a microservices-based food delivery platform with the following services:</p>
        <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <li><strong>User Service:</strong> Handles user registration and authentication</li>
          <li><strong>Restaurant Service:</strong> Manages restaurants and their menus</li>
          <li><strong>Order Service:</strong> Processes and tracks orders</li>
          <li><strong>Notification Service:</strong> Sends order updates to users</li>
          <li><strong>API Gateway:</strong> Routes requests to appropriate services</li>
        </ul>
      </div>

      <div className="card">
        <h2>Quick Links</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/restaurants">
            <button>Browse Restaurants</button>
          </Link>
          {user ? (
            <Link to="/orders">
              <button>View My Orders</button>
            </Link>
          ) : (
            <Link to="/login">
              <button>Login to Order</button>
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Features</h2>
        <div className="grid">
          <div className="card">
            <h3>🍔 Multiple Restaurants</h3>
            <p>Choose from a variety of restaurants and cuisines</p>
          </div>
          <div className="card">
            <h3>📱 Real-time Tracking</h3>
            <p>Track your order status in real-time</p>
          </div>
          <div className="card">
            <h3>🔔 Notifications</h3>
            <p>Get notified about your order updates</p>
          </div>
          <div className="card">
            <h3>⭐ Reviews & Ratings</h3>
            <p>Check restaurant ratings before ordering</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
