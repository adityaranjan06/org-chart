import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  // Hardcoded admin credentials
  const [email] = useState("aditya@gmail.com");
  const [password] = useState("123456");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prepare form data for login
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await api.post("/admin/login", formData);
      // Save token and redirect to admin dashboard
      localStorage.setItem("adminToken", response.data.access_token);
      navigate("/admin/company");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.detail);
      alert("Login failed: " + error.response?.data?.detail);
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2 className="heading">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" value={email} readOnly />

          <label>Password</label>
          <input type="password" value={password} readOnly />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
