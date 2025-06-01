import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login/", { username, password });
      if (response.data && response.data.message === "Login successful") {
        onLoginSuccess(); // Callback to update App's auth state
      } else {
        setError(response.data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response && err.response.status === 400) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic registration form (optional, can be expanded or moved to a separate page)
  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please enter username and password to register.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await axios.post("/api/register/", { username, password });
      // Optionally, log them in directly after registration or show a success message
      alert("Registration successful! Please log in.");
      // Or attempt login:
      // const loginResponse = await axios.post('/api/login/', { username, password });
      // if (loginResponse.data && loginResponse.data.message === 'Login successful') {
      //   onLoginSuccess();
      // }
    } catch (regError) {
      if (regError.response && regError.response.data) {
        let errorMsg = "Registration failed: ";
        for (const key in regError.response.data) {
          errorMsg += `${key}: ${regError.response.data[key].join(", ")} `;
        }
        setError(errorMsg);
      } else {
        setError("An error occurred during registration.");
      }
      console.error("Registration error:", regError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600">
          Log in to manage your meetings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
