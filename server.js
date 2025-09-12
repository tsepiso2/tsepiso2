const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');

// ✅ Ensure data folder and JSON files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(path.join(DATA_DIR, 'products.json'))) {
  fs.writeFileSync(path.join(DATA_DIR, 'products.json'), '[]', 'utf8');
}
if (!fs.existsSync(path.join(DATA_DIR, 'transactions.json'))) {
  fs.writeFileSync(path.join(DATA_DIR, 'transactions.json'), '[]', 'utf8');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build'))); // Serve React build

// Helper functions
const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
const writeJson = (file, data) =>
  fs.writeFileSync(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    'utf8'
  );

// ---------------- Products API ----------------
app.get('/api/products', (req, res) => {
  try {
    const products = readJson('products.json');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = readJson('products.json');
    const newProduct = { id: Date.now(), ...req.body };

    // ✅ Ensure quantity starts at 0 if not provided
    if (typeof newProduct.quantity !== 'number') {
      newProduct.quantity = 0;
    }

    products.push(newProduct);
    writeJson('products.json', products);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const products = readJson('products.json');
    const index = products.findIndex((p) => p.id === parseInt(req.params.id));

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      writeJson('products.json', products);
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    let products = readJson('products.json');
    products = products.filter((p) => p.id !== parseInt(req.params.id));
    writeJson('products.json', products);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ---------------- Transactions API ----------------
app.get('/api/transactions', (req, res) => {
  try {
    const transactions = readJson('transactions.json');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read transactions' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const { productId, quantity, type, price } = req.body; // price for sales only
    const products = readJson('products.json');
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newTransaction = {
      id: Date.now(),
      productId,
      quantity,
      type, // 'add' or 'sell'
      amount: type === 'sell' ? quantity * price : 0,
      date: new Date().toISOString(),
    };

    const transactions = readJson('transactions.json');
    transactions.push(newTransaction);
    writeJson('transactions.json', transactions);

    // Update product quantity
    if (type === 'add') {
      products[productIndex].quantity += quantity;
    } else if (type === 'sell') {
      if (products[productIndex].quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      products[productIndex].quantity -= quantity;
    }
    writeJson('products.json', products);

    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

// ---------------- React Catch-all (fixed) ----------------
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
