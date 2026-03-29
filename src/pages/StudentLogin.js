import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===============================
  // AUTO SESSION CHECK (NEW)
  // ===============================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const student = localStorage.getItem("student");

    if (token && student) {
      console.log("Student already logged in");
      navigate("/StudentDashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok && data.status === "success") {

        // ===============================
        // STORE STUDENT SESSION DATA
        // ===============================

        localStorage.setItem("student", JSON.stringify(data.user));

        // STORE SESSION TOKEN
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          console.warn("Token not received from server");
        }

        // REMOVE EMPLOYEE SESSION
        localStorage.removeItem("employee");

        console.log("Student saved in localStorage:", data.user);

        navigate("/StudentDashboard");

      } else {
        alert(data.message || "Invalid credentials ❌");
      }

    } catch (error) {
      console.error("Login error:", error);
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
          Student Portal
        </p>

        {/* FORM START */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default StudentLogin;