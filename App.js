import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reporting from './components/Reporting';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header>
          <h1>Welcome to Wings Cafe.</h1>
          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/reporting">Reporting</Link></li>
            </ul>
          </nav>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reporting" element={<Reporting />} />
          </Routes>
        </main>

        
        <footer style={{
          backgroundColor: '#333',
          color: '#fff',
          textAlign: 'center',
          padding: '15px 10px',
          marginTop: '20px'
        }}>
          <p>
            Contact me: <a href="mailto:tsepisomonokoane24@gmail.com" style={{ color: '#00ffff' }}>tsepisomonokoane24@gmail.com</a> | WhatsApp: <a href="https://wa.me/26669175507" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00' }}>+266 69175507</a>
          </p>
          <p>&copy; 2025 Wings Cafe </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
