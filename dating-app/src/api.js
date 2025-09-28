import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

// Signup now supports FormData
export const signup = (formData) =>
  API.post("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const login = (user) => API.post("/auth/login", user);

export const fetchUsers = (token) =>
  API.get("/users", { headers: { Authorization: `Bearer ${token}` } });
