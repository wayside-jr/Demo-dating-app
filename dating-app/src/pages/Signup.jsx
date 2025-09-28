import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api";
import "./signup.css"; // import the CSS file

export default function Signup({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (photo) formData.append("photo", photo);

      // Signup user
      await signup(formData);

      setMsg("Account created! Logging in...");

      // Auto-login after signup
      const res = await login({ email, password });
      const data = res.data;
      const token = data.access_token;

      const userData = {
        username: data.username,
        email,
        photo: data.photo || "",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("photo", userData.photo);

      onLogin(token, userData);

      navigate("/users");
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h3 className="signup-title">Sign Up</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
        {msg && (
          <p className={`signup-msg ${msg.includes("failed") ? "error" : "success"}`}>
            {msg}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
