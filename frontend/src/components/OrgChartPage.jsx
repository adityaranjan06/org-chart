import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";

function OrgChartPage() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees(); // Fetch employee data on mount
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employee/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
      alert("Failed to fetch employees. Please try again later.");
    }
  };

  // Build tree structure for the org chart
  const buildTree = () => {
    const idMapping = employees.reduce((acc, el) => {
      acc[el.id] = { ...el, children: [] };
      return acc;
    }, {});

    let roots = [];
    employees.forEach(emp => {
      if (emp.manager_id && idMapping[emp.manager_id]) {
        idMapping[emp.manager_id].children.push(idMapping[emp.id]);
      } else {
        roots.push(idMapping[emp.id]);
      }
    });

    return roots.length > 0 ? roots[0] : null;
  };

  const treeData = employees.length > 0 ? buildTree() : null;

  const handleAdd = () => {
    navigate("/orgchart/add");
  };

  const onEdit = (employeeId) => {
    navigate(`/orgchart/edit/${employeeId}`);
  };

  const onDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employee/${employeeId}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee", error);
        alert("Failed to delete employee");
      }
    }
  };

  // Component to render each node in the org chart
  const NodeComponent = ({ node }) => {
    return (
      <div
        className="node"
        style={{
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: "#fff",
          textAlign: "center",
          minWidth: "120px",
          fontSize: "12px"
        }}
      >
        <h4 style={{ margin: "2px 0" }}>{node.name}</h4>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>{node.title}</p>
        {node.performance_ratings?.length > 0 && (
          <div className="performance-metrics" style={{ fontSize: "10px" }}>
            <h5 style={{ margin: "2px 0" }}>P.M:</h5>
            {node.performance_ratings.map((metric, index) => (
              <span key={index} style={{ margin: "0 3px" }}>
                {metric.category}: <b>{metric.rating}/5</b>
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: "5px" }}>
          <button style={{ fontSize: "10px", margin: "2px" }} onClick={() => onEdit(node.id)}>Edit</button>
          <button style={{ fontSize: "10px", margin: "2px" }} onClick={() => onDelete(node.id)}>Delete</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {employees.length > 0 ? (
        treeData ? (
          <OrgChart tree={treeData} NodeComponent={NodeComponent} />
        ) : (
          <p>Building org chart...</p>
        )
      ) : (
        <p>No employees found. Start by adding a new employee.</p>
      )}
      <button
        onClick={handleAdd}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  );
}

export default OrgChartPage;
