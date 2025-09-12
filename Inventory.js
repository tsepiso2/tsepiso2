import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', price: '', quantity: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const [stockForm, setStockForm] = useState({ productId: '', quantity: '', type: 'add' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://wings-backend.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products. Ensure server is running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.quantity) {
      setError('Please fill all required fields.');
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    };

    if (isNaN(submitData.price) || isNaN(submitData.quantity)) {
      setError('Price must be a number, Quantity must be an integer.');
      return;
    }

    try {
      if (editId) {
        await axios.put(`https://render.com/docs/web-services#port-binding/${editId}`, submitData);
        setEditId(null);
      } else {
        await axios.post('https://wings-backend.onrender.com/api/transactions', submitData);
      }
      setFormData({ name: '', description: '', category: '', price: '', quantity: '', imageUrl: '' });
      setError('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editId ? 'update' : 'add'} product: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      imageUrl: product.imageUrl || '',
    });
    setEditId(product.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`https://render.com/docs/web-services#port-binding/${id}`);
        setError('');
        fetchProducts();
      } catch (err) {
        console.error(err);
        setError(`Failed to delete product: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleStockChange = async (e) => {
    e.preventDefault();
    const { productId, quantity, type } = stockForm;
    if (!productId || !quantity) {
      setError('Please select a product and enter quantity.');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive integer.');
      return;
    }

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      setError('Product not found.');
      return;
    }

    if (type === 'sell' && product.quantity < qty) {
      setError('Insufficient stock for sale.');
      return;
    }

    const transactionData = {
      productId: parseInt(productId),
      quantity: qty,
      type,
      price: type === 'sell' ? product.price : undefined,
    };

    try {
      await axios.post('https://render.com/docs/web-services#port-binding', transactionData);
      setStockForm({ productId: '', quantity: '', type: 'add' });
      setError('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(`Failed to update stock: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      {error && (
        <div style={{ background: '#ff6b6b', color: 'white', padding: '1rem', margin: '1rem', borderRadius: '5px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
          <option value="">Category</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main">Main</option>
          <option value="Dessert">Dessert</option>
        </select>
        <input type="number" step="0.01" placeholder="Price (M)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
        <input type="number" placeholder="Initial Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
        <input placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        <button type="submit">{editId ? 'Update' : 'Add'} Product</button>
      </form>

      <h3>Current Products</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Price (M)</th><th>Quantity</th><th>Actions</th><th>Alert</th></tr>
        </thead>
        <tbody>
          {products.map(p => {
            const isLowStock = p.quantity <= 5; // Low stock threshold
            return (
              <tr key={p.id} style={{ backgroundColor: isLowStock ? '#ffe6e6' : 'transparent' }}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{marginRight: '0.5rem'}}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
                <td>
                  {isLowStock && <span style={{ color: 'red', fontWeight: 'bold' }}>⚠ Low Stock!</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h3>Stock Management</h3>
      <form onSubmit={handleStockChange}>
        <select value={stockForm.productId} onChange={e => setStockForm({...stockForm, productId: e.target.value})} required>
          <option value="">Select Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={stockForm.quantity} onChange={e => setStockForm({...stockForm, quantity: e.target.value})} required min="1" />
        <select value={stockForm.type} onChange={e => setStockForm({...stockForm, type: e.target.value})}>
          <option value="add">Add Stock</option>
          <option value="sell">Remove Stock (Sell)</option>
        </select>
        <button type="submit">Update Stock</button>
      </form>
    </div>
  );
};

export default Inventory;
