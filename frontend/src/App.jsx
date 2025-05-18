import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const handleAuthSubmit = (data) => {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      data.name || "User"
    )}&background=random`;
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: avatarUrl,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
    );
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />
      <Route
        element={
          currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route
          path="/profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />
      </Route>
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      ></Route>
    </Routes>
  );
};

export default App;
