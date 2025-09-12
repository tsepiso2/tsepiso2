import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://wings-backend.onrender.com/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const lowStockProducts = products.filter(p => p.quantity < 5);

  return (
    <div>
      <h2>Your shortcut to happy tastebuds!!</h2>
      {lowStockProducts.length > 0 && (
        <div className="alert" style={{background: '#ff6b6b', color: 'white', padding: '1rem', margin: '1rem', borderRadius: '5px'}}>
          Alert: {lowStockProducts.length} products low on stock!
        </div>
      )}
      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className={`product-card ${product.quantity < 5 ? 'low-stock' : ''}`}>
            <img src={product.imageUrl || 'https://via.placeholder.com/250x150?text=Wings'} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Price: M {product.price}</p>
            <p>Stock: {product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
