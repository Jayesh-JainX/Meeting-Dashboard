import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MeetingsDashboard from "./pages/MeetingsDashboard";
import LoginPage from "./pages/LoginPage";
import AddEditMeetingPage from "./pages/AddEditMeetingPage";
import ViewMeetingPage from "./pages/ViewMeetingPage"; // Import the new page
import axios from "axios";

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Configure axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;
// Set a base URL for API calls if your Django app is on a different port during development
// This is also handled by Vite proxy, but can be explicit here too.
// axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Add a request interceptor to include CSRF token in headers for relevant methods
axios.interceptors.request.use(
  function (config) {
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(config.method.toUpperCase())
    ) {
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status when app loads (e.g., by hitting a protected endpoint or checking a stored token/session)
    // For session-based auth, a simple way is to try fetching user data.
    // This is a placeholder. A more robust check would be to have an endpoint like /api/user/me
    // that returns user data if authenticated, or 401 if not.
    const checkAuth = async () => {
      try {
        // Example: if you have an endpoint that returns user info if logged in
        // const response = await axios.get('/api/auth/user/'); // Adjust endpoint as needed
        // if (response.status === 200) {
        //   setIsAuthenticated(true);
        // }
        // For now, let's assume if there's a session cookie, a protected route will work.
        // A better check is needed for production.
        // We'll manage auth state more explicitly after login/logout.
        // For simplicity, we'll start unauthenticated.
        // setIsAuthenticated(false); // Or true if you have a way to persist login
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/meetings"); // Navigate to dashboard after login
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout/"); // Django backend will clear the session
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a notification)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    ); // Or a proper spinner
  }

  return (
    <div className="flex h-screen bg-main-bg">
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      <main className={`flex-1 overflow-auto ${isAuthenticated ? "p-6" : ""}`}>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/meetings" />
              )
            }
          />

          <Route
            path="/meetings"
            element={
              isAuthenticated ? <MeetingsDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/meetings/new"
            element={
              isAuthenticated ? (
                <AddEditMeetingPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/meetings/edit/:id"
            element={
              isAuthenticated ? (
                <AddEditMeetingPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/meetings/view/:id"
            element={
              isAuthenticated ? <ViewMeetingPage /> : <Navigate to="/login" />
            }
          />

          {/* Default route: redirect to login if not authenticated, else to meetings */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/meetings" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
