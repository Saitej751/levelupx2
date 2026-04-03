import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [employee_email, setEmployeeEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://levelupx2-backend.onrender.com/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employee_email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        
        // ✅ Clear student session
        localStorage.removeItem("student");
        

        // ✅ Store employee
        localStorage.setItem("employee", JSON.stringify(data.user));

        navigate("/EmployeeDashboard");
      } else {
        alert(data.message || "Invalid credentials ❌");
      }

    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "30px",
          padding: "60px 50px",
          width: "420px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <h1 style={{ fontSize: "30px", marginBottom: "5px" }}>
          LevelUp<span style={{ color: "#f97316" }}>X</span>
        </h1>

        <p style={{ color: "#cbd5e1", marginBottom: "35px" }}>
          Employee Portal
        </p>

        {/* FORM START */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Employee Email"
            value={employee_email}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
        {/* FORM END */}

        <p
          style={{
            marginTop: "20px",
            fontSize: "13px",
            color: "#cbd5e1",
            cursor: "pointer",
          }}
          onClick={() => navigate("/enterprise")}
        >
          ← Back to Selection
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "20px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ea580c)",
  color: "white",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  transition: "0.3s ease",
};

export default EmployeeLogin;