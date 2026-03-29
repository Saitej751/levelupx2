import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ theme, switchTheme }) {
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [role, setRole] = useState("");

  useEffect(() => {
    const student = localStorage.getItem("student_id");
    const employee = localStorage.getItem("employee_id");

    if (student) {
      setRole("Student");
    } else if (employee) {
      setRole("Employee");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("employee_id");

    if (role === "Student") {
      navigate("/student-login");
    } else {
      navigate("/employee-login");
    }
  };

  return (
    <div
      style={{
        height: "70px",
        backgroundColor: isDark ? "#1e293b" : "white",
        color: isDark ? "white" : "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "0.3s"
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "600", fontSize: "20px" }}>
        LevelUp<span style={{ color: "#f97316" }}>X</span>
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span>Hello {role}</span>

        {/* Theme Toggle */}
        <div
          style={{
            display: "flex",
            backgroundColor: isDark ? "#334155" : "#e2e8f0",
            borderRadius: "20px",
            padding: "4px"
          }}
        >
          <button
            onClick={() => switchTheme("light")}
            style={toggleStyle(theme === "light")}
          >
            Light
          </button>

          <button
            onClick={() => switchTheme("dark")}
            style={toggleStyle(theme === "dark")}
          >
            Dark
          </button>
        </div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          style={{
            width: "38px",
            height: "38px",
            backgroundColor: "#f97316",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          ⎋
        </div>
      </div>
    </div>
  );
}

const toggleStyle = (active) => ({
  padding: "6px 12px",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  backgroundColor: active ? "#f97316" : "transparent",
  color: active ? "white" : "inherit",
  fontSize: "12px",
  fontWeight: "500"
});

export default Header;