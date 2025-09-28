import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProfile({ token, currentUser, setCurrentUser, onLogout }) {
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [photo, setPhoto] = useState(currentUser.photo || null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Fetch current user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
        setPhoto(res.data.photo);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (photo instanceof File) formData.append("photo", photo);

      const res = await axios.put("http://127.0.0.1:5000/auth/edit", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data;

      // Update localStorage
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("email", updatedUser.email);
      localStorage.setItem("photo", updatedUser.photo || "");

      // Update parent state
      setCurrentUser && setCurrentUser(updatedUser);

      setMsg("Profile updated successfully!");
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Update failed");
    }
  };

  // Delete account function
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await axios.delete("http://127.0.0.1:5000/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear storage & logout
      localStorage.clear();
      setCurrentUser && setCurrentUser({ username: "", email: "", photo: "" });
      onLogout && onLogout();
      navigate("/auth");
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Edit Profile</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "8px",
          backgroundColor: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Delete Account
      </button>
    </div>
  );
}
