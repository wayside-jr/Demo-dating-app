import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";

export default function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // logged in user info from localStorage
  const loggedUser = {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleChat = (user) => {
    localStorage.setItem("chatWith", JSON.stringify(user));
    navigate(`/chat/${user.id}`, {
      state: { username: user.username },
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const mainUser = users[currentIndex];

  return (
    <div className="users-page">
      {/* Side panel */}
      <aside className="users-sidepanel">
        <h2>Logged In</h2>
        <h3>{loggedUser.username}</h3>
        <p>{loggedUser.email}</p>
       
      </aside>

      {/* Main content */}
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
                  src={`https://i.pravatar.cc/600?u=${mainUser.id}`}
                  alt={mainUser.username}
                  className="user-photo big"
                />
                <div className="user-info-overlay">
                  <h3>{mainUser.username}</h3>
                  <p>{mainUser.email}</p>
                </div>
              </div>
              {/* Chat button outside the card */}
              <button
                onClick={() => handleChat(mainUser)}
                className="chat-btn outside"
              >
                Chat
              </button>
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
