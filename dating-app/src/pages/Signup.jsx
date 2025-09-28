import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api"; // we’ll adapt this to accept FormData

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null); // NEW state for image
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // build multipart form data
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (photo) {
        formData.append("photo", photo);
      }

      // call signup API with formData instead of JSON
      await signup(formData);

      setMsg("Account created! You can login now.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // fallback if error structure different
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

      {/* NEW photo input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
