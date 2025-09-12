import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sales() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [sale, setSale] = useState({ productId: "", amount: 0 });
  const [error, setError] = useState("");


  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = () => {
    axios.get("https://wings-backend.onrender.com/api/products")

      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  };

  const fetchProducts = () => {
    axios.get("https://wings-backend.onrender.com/api/products")

      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const addSale = () => {
    const product = products.find((p) => p.id === parseInt(sale.productId));
    if (!product) {
      setError("Product not found.");
      return;
    }
    if (sale.amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (product.stock < sale.amount) {
      setError("Insufficient stock for this sale.");
      return;
    }

    axios.post("https://wings-backend.onrender.com/api/transactions", {
        productId: product.id,
        quantity: sale.amount,
        type: "sale",
        price: product.price,
      })
      .then((res) => {
        setTransactions([...transactions, res.data]);
        setSale({ productId: "", amount: 0 });
        setError("");
        fetchProducts(); // refresh stock after sale
      })
      .catch((err) => setError("Failed to record sale."));
  };

  const LOW_STOCK_THRESHOLD = 5;

  return (
    <div>
      <h2>Sales</h2>

      {error && (
        <div style={{ background: "#ff6b6b", color: "white", padding: "1rem", margin: "1rem 0", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addSale();
        }}
      >
        <select
          value={sale.productId}
          onChange={(e) => setSale({ ...sale, productId: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={sale.amount}
          onChange={(e) => setSale({ ...sale, amount: +e.target.value })}
          required
          min="1"
        />
        <button type="submit">Record Sale</button>
      </form>

      <h3>Transactions</h3>
      <ul>
        {transactions.map((t, i) => {
          const product = products.find((p) => p.id === t.productId);
          const isLowStock = product && product.stock <= LOW_STOCK_THRESHOLD;
          return (
            <li key={i} style={{ color: isLowStock ? "red" : "black", fontWeight: isLowStock ? "bold" : "normal" }}>
              {t.type} - {t.product} - {t.quantity} {isLowStock && "⚠ Low Stock!"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
