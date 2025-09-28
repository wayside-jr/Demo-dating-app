import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProfile({ token, currentUser, setCurrentUser }) {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [photo, setPhoto] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

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

      // Update parent state for side panel refresh
      setCurrentUser(updatedUser);

      setMsg("Profile updated successfully!");
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Update failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Edit Profile</h2>
        {msg && <p>{msg}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
