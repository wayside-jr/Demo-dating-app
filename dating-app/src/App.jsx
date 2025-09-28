import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import AuthPage from "./pages/AuthPage";
import EditProfile from "./pages/EditProfile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState({
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    photo: localStorage.getItem("photo") || "",
  });

  // Sync currentUser to localStorage
  useEffect(() => {
    localStorage.setItem("username", currentUser.username);
    localStorage.setItem("email", currentUser.email);
    localStorage.setItem("photo", currentUser.photo || "");
  }, [currentUser]);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setCurrentUser({
      username: userData.username,
      email: userData.email,
      photo: userData.photo || "",
    });
  };

  const handleLogout = () => {
    setToken("");
    localStorage.clear();
    setCurrentUser({ username: "", email: "", photo: "" });
  };

  return (
    <Router>
      <div>
        {/* Global Logout button */}
        {token && (
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "6px 12px",
              background: "#e53935",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}

        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={token ? <Navigate to="/users" /> : <Navigate to="/auth" />}
          />

          {/* Auth page */}
          <Route
            path="/auth"
            element={
              token
                ? <Navigate to="/users" />
                : <AuthPage onLogin={handleLogin} />
            }
          />

          {/* Users page */}
          <Route
            path="/users"
            element={
              token
                ? <Users
                    token={token}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                : <Navigate to="/auth" />
            }
          />

          {/* Chat page */}
          <Route
            path="/chat/:id"
            element={token ? <Chat token={token} /> : <Navigate to="/auth" />}
          />

          {/* Edit profile */}
          <Route
            path="/edit-profile"
            element={
              token
                ? <EditProfile
                    token={token}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    onLogout={handleLogout}
                  />
                : <Navigate to="/auth" />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
