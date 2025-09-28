import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

export const signup = (user) => API.post("/auth/signup", user);
export const login = (user) => API.post("/auth/login", user);
export const fetchUsers = (token) => API.get("/users", { headers: { Authorization: `Bearer ${token}` } });
