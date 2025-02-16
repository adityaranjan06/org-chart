// src/components/admindashboard
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  // State for storing company name input
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  // Handle form submission to create a new company
  const handleCreateCompany = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/company", { name: companyName });
      alert("Company created successfully!");
      setCompanyName("");
    } catch (error) {
      console.error("Error creating company:", error.response?.data?.detail);
      alert("Error: " + error.response?.data?.detail);
    }
  };

  // Logout admin: clear token and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2 className="heading">Admin Dashboard</h2>
        <form onSubmit={handleCreateCompany}>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <button type="submit">Create Company</button>
        </form>
        <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
