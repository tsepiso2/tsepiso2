import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reporting() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("https://wings-backend.onrender.com/api/products")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            {t.type} - {t.product} - {t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
