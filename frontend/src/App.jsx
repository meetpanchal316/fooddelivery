import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminOrders from './pages/AdminOrders';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
          {user && <li><Link to="/orders">My Orders</Link></li>}
          {user && user.role === 'admin' && (
            <>
              <li><Link to="/admin/restaurants">Manage Restaurants</Link></li>
              <li><Link to="/admin/orders">Manage Orders</Link></li>
            </>
          )}
          {!user ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li style={{ marginLeft: 'auto' }}>Welcome, {user.name}!</li>
              <li><button onClick={handleLogout} style={{ background: 'transparent', padding: '0' }}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail user={user} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/admin/restaurants" element={<AdminRestaurants user={user} />} />
          <Route path="/admin/orders" element={<AdminOrders user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
