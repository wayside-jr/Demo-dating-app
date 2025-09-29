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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Side Panel */}
      <aside
        style={{
          width: "250px",
          background: "#f4f4f4",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        {currentUser?.photo ? (
          <img
            src={`http://127.0.0.1:5000/uploads/${currentUser.photo}`}
            alt={currentUser.username}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "#ccc",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        )}
        <h3 style={{ margin: "5px 0" }}>{currentUser.username}</h3>
        <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>{currentUser.email}</p>

        <button
          onClick={() => navigate("/edit-profile")}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Edit Profile
        </button>
      </aside>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          maxWidth: "600px",
          margin: "50px auto",
          padding: "20px",
        }}
      >
        <h2>Edit Profile</h2>
        {msg && <p style={{ color: msg.includes("failed") ? "red" : "green" }}>{msg}</p>}

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
    </div>
  );
}