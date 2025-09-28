import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import AuthPage from "./pages/AuthPage"; // ✅ our combined page

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Save token after login
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout user
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div>
        {/* Logout button */}
        {token && (
          <button onClick={handleLogout} style={{ margin: "10px" }}>
            Logout
          </button>
        )}

        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={token ? <Navigate to="/users" /> : <Navigate to="/auth" />}
          />

          {/* Combined Auth (Login + Signup) */}
          <Route
            path="/auth"
            element={
              token ? <Navigate to="/users" /> : <AuthPage onLogin={handleLogin} />
            }
          />

          {/* Users list */}
          <Route
            path="/users"
            element={token ? <Users token={token} /> : <Navigate to="/auth" />}
          />

          {/* Chat page */}
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
