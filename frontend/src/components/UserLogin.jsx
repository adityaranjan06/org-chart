import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });
      // Store the token in localStorage
      localStorage.setItem("userToken", response.data.access_token);
      // Redirect to OrgChartPage after successful login
      navigate("/orgchart");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.detail);
      alert("Login failed: " + (error.response?.data?.detail || "An unexpected error occurred"));
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2 className="heading">User Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
