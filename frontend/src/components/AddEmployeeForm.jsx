import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AddEmployeeForm() {
  // State for employee details and performance ratings
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [managerId, setManagerId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [performanceRatings, setPerformanceRatings] = useState({
    "Technical Skills": "",
    "Communication": "",
    "Leadership": "",
    "Initiative": ""
  });
  const navigate = useNavigate();

  // Fetch existing employees for manager selection on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employee/");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmployees();
  }, []);

  // Update rating for a specific performance category
  const handleRatingChange = (category, value) => {
    setPerformanceRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Submit form data to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format performance ratings as an array
      const ratingsArray = Object.entries(performanceRatings)
        .filter(([_, rating]) => rating)
        .map(([category, rating]) => ({ category, rating: parseInt(rating) }));

      await api.post("/employee/", {
        name,
        title,
        email,
        manager_id: managerId ? parseInt(managerId) : null,
        performance_ratings: ratingsArray
      });
      navigate("/orgchart");
    } catch (error) {
      console.error("Error adding employee", error);
      alert("Failed to add employee");
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Manager</label>
          <select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
            <option value="">None</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.title}
              </option>
            ))}
          </select>

          <div className="performance-ratings">
            <h3>Performance Metrics</h3>
            {Object.entries(performanceRatings).map(([category, rating]) => (
              <div key={category} className="rating-field">
                <label>{category}</label>
                <select
                  value={rating}
                  onChange={(e) => handleRatingChange(category, e.target.value)}
                  required
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button type="submit">Add Employee</button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeForm;
