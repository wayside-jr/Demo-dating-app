// src/App.jsx
import React from "react";                 // ✅ add this
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import AuthPage from "./pages/AuthPage"; // ✅ our combined page

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div>
        {token && (
          <button onClick={handleLogout} style={{ margin: "10px" }}>
            Logout
          </button>
        )}

        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/users" /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={
              token ? <Navigate to="/users" /> : <AuthPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/users"
            element={token ? <Users token={token} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chat/:id"
            element={token ? <Chat token={token} /> : <Navigate to="/auth" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
