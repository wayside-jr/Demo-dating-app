import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";

export default function Users({ token, currentUser, setCurrentUser, onLogout }) {
  const [users, setUsers] = useState([]);
  const [likedUserIds, setLikedUserIds] = useState([]); // store ids liked by current user
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const loggedUser = currentUser;

  // Fetch other users (with likes_count)
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Fetch who I already liked
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/likes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = await res.json();
        setLikedUserIds(ids);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikes();
  }, [token]);

  const handleChat = (user) => {
    localStorage.setItem("chatWith", JSON.stringify(user));
    navigate(`/chat/${user.id}`, { state: { username: user.username } });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleLogout = () => {
    onLogout && onLogout();
    navigate("/auth");
  };

  // like/unlike toggle
  const handleLike = async (user) => {
    const liked = likedUserIds.includes(user.id);
    try {
      if (liked) {
        await fetch(`http://127.0.0.1:5000/likes/${user.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedUserIds((prev) => prev.filter((id) => id !== user.id));
        // decrement local count
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, likes_count: u.likes_count - 1 } : u
          )
        );
      } else {
        await fetch(`http://127.0.0.1:5000/likes/${user.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedUserIds((prev) => [...prev, user.id]);
        // increment local count
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, likes_count: u.likes_count + 1 } : u
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const mainUser = users[currentIndex];

  return (
    <div className="users-page">
      <aside className="users-sidepanel">
        {loggedUser.photo ? (
          <img
            src={`http://127.0.0.1:5000/uploads/${loggedUser.photo}`}
            alt={loggedUser.username}
            className="sidepanel-photo"
          />
        ) : (
          <div className="sidepanel-placeholder">No Photo</div>
        )}
        <h3>{loggedUser.username}</h3>
        <p>{loggedUser.email}</p>

        <button
          onClick={handleEditProfile}
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

      <main className="users-main">
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          <div className="user-card-wrapper">
            <button className="arrow-btn left" onClick={handlePrev}>
              &#8592;
            </button>

            <div className="user-card-block">
              <div key={mainUser.id} className="user-card big">
                <img
                  src={
                    mainUser.photo
                      ? `http://127.0.0.1:5000/uploads/${mainUser.photo}`
                      : `https://i.pravatar.cc/600?u=${mainUser.id}`
                  }
                  alt={mainUser.username}
                  className="user-photo big"
                />
                <div className="user-info-overlay">
                  <h3>{mainUser.username}</h3>
                  
                  <p>
                    ❤️ {mainUser.likes_count}{" "}
                    {likedUserIds.includes(mainUser.id)}
                  </p>
                </div>
              </div>

              <div className="user-actions">
                <button
                  onClick={() => handleLike(mainUser)}
                  className="like-btn"
                  style={{
                    padding: "6px 8px",
                    marginRight: "8px",
                    background: likedUserIds.includes(mainUser.id)
                      ? "#e70b0bff"
                      : "#e5e7eb",
                    color: likedUserIds.includes(mainUser.id) ? "#fff" : "#000",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {likedUserIds.includes(mainUser.id) ? "Unlike" : "Like"}
                </button>

                <button
                  onClick={() => handleChat(mainUser)}
                  className="chat-btn outside"
                  style={{
                    padding: "8px 8px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Chat
                </button>
              </div>
            </div>

            <button className="arrow-btn right" onClick={handleNext}>
              &#8594;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}