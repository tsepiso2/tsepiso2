// src/api.js
import axios from "axios";

// Base Axios instance pointing to backend API
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default api;
