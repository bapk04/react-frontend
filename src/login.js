import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import config from "./config";
import './Auth.css';

const API_LOCATION = config.api_location;

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Kiểm tra tài khoản admin cố định
      if (email === 'admin@gmail.com' && password === '123123') {
        localStorage.setItem("username", "admin");
        setIsLoggedIn(true);
        navigate('/admin'); // Điều hướng tới trang admin
        return;
      }

      // Đăng nhập thông thường cho các tài khoản khác
      const response = await axios.post(API_LOCATION + "/api/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", response.data.username);
        setIsLoggedIn(true);
        navigate('/join'); // Điều hướng tới trang join
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("username", "Guest"); // Assign a default username for guest users
    setIsLoggedIn(true);
    navigate('/join');
  };

  return (
    <div className="background">
      <div className="auth-container">
        <div className="login-section">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="redirect-text">
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
        <div className="guest-section">
          <h2>Use without account</h2>
          <button onClick={handleGuestLogin} className="btn guest-btn">Continue as Guest</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
