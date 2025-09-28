import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ username, email, password });
      setMsg("Account created! You can login now.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response.data.msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {msg && <p>{msg}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <button type="submit">Sign Up</button>
    </form>
  );
}
