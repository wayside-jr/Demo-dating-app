import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api"; // adapted for FormData

export default function Signup() {
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

      await signup(formData);

      setMsg("Account created! You can login now.");
      setUsername("");
      setEmail("");
      setPassword("");
      setPhoto(null);

      // Redirect to Auth page (where login form exists)
      setTimeout(() => navigate("/auth"), 1500);
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Sign Up</h2>
      {msg && <p>{msg}</p>}

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
  );
}
