import React from "react";
import "./styles.css";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import UserLogin from "./components/UserLogin";
import Signup from "./components/Signup";
import Error from "./components/Error";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import OrgChartPage from "./components/OrgChartPage"; // Import the OrgChartPage component
import AddEmployeeForm from "./components/AddEmployeeForm";
import EditEmployeeForm from "./components/EditEmployeeForm"; // Add this line
import api from "./api"; // Import API instance

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Home - Redirect to User Login */}
        <Route path="/" element={<UserLogin />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/company" element={<AdminDashboard />} />
        {/* User Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        {/* Org Chart Route */}
        <Route path="/orgchart" element={<OrgChartPage />} />
        <Route path="/orgchart/add" element={<AddEmployeeForm />} />
        <Route path="/orgchart/edit/:employeeId" element={<EditEmployeeForm />} />
        {/* Default Route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
