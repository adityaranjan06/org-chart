import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function EditEmployeeForm() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current employee data and all employees for manager selection
        const empResponse = await api.get(`/employee/${employeeId}`);
        const employee = empResponse.data;
        setName(employee.name);
        setTitle(employee.title);
        setEmail(employee.email);
        setManagerId(employee.manager_id || "");

        if (employee.performance_ratings?.length > 0) {
          const ratingsObj = {
            "Technical Skills": "",
            "Communication": "",
            "Leadership": "",
            "Initiative": ""
          };
          employee.performance_ratings.forEach(r => {
            ratingsObj[r.category] = r.rating;
          });
          setPerformanceRatings(ratingsObj);
        }

        const allEmps = await api.get("/employee/");
        setEmployees(allEmps.data);
      } catch (error) {
        console.error("Error fetching data", error);
        alert("Failed to load employee data");
      }
    };
    fetchData();
  }, [employeeId]);

  // Update a specific performance rating
  const handleRatingChange = (category, value) => {
    setPerformanceRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ratingsArray = Object.entries(performanceRatings)
        .filter(([_, rating]) => rating)
        .map(([category, rating]) => ({ category, rating: parseInt(rating) }));

      await api.put(`/employee/${employeeId}`, {
        name,
        title,
        email,
        manager_id: managerId ? parseInt(managerId) : null,
        performance_ratings: ratingsArray
      });
      navigate("/orgchart");
    } catch (error) {
      console.error("Error updating employee", error);
      alert("Failed to update employee");
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2>Edit Employee</h2>
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
            {employees
              .filter(emp => emp.id !== parseInt(employeeId))
              .map((emp) => (
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

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeForm;
