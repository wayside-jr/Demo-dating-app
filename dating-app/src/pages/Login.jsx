import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      const data = res.data;
      const token = data.access_token;

      const userData = {
        username: data.username,
        email: data.email, // use backend-provided email for consistency
        photo: data.photo || "",
      };

      // Save token & user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("photo", userData.photo);

      // Update App state
      onLogin(token, userData);

      // Redirect to Users page
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {error && (
        <span style={{ color: "red", fontSize: "0.85rem" }}>{error}</span>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "6px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: "6px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "6px 14px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  );
}
