import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminAuth.css';

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admin-login", {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("username", "admin");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    } catch (error) {
      setError("Failed to login. Please check your connection.");
    }
  };

  return (
    <div className="admin-background">
      <div className="admin-auth-container">
        <h2>Admin Login</h2>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
