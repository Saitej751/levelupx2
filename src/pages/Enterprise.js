import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Enterprise() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const handleEmployee = () => {
    setSelected("employee");
    navigate("/EmployeeLogin");
  };

  const handleStudent = () => {
    setSelected("student");
    navigate("/StudentLogin");
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url(/classroom.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1,
        }}
      />

      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 8%",
          background: "rgba(255,255,255,0.9)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: "28px", fontWeight: "700" }}>
          LevelUp<span style={{ color: "#eb6606" }}>X</span>
        </div>

        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "40px",
            fontWeight: 500,
          }}
        >
          <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </li>
          <li>Features</li>
          <li>Solutions</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "#f97316",
            border: "none",
            padding: "12px 26px",
            borderRadius: "8px",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          BACK TO HOME
        </button>
      </nav>

      {/* CENTER CARD */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(189, 151, 88, 0.47)",
            padding: "60px 80px",
            borderRadius: "25px",
            textAlign: "center",
            color: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            width: "480px",
            border: "1px solid rgba(113, 72, 72, 0.2)",
          }}
        >
          <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>
            LevelUpX{" "}
            <span style={{ color: "#f97316" }}>
              CAMPUS TECHNOLOGIES
            </span>
          </h1>

          <h3 style={{ marginBottom: "40px", fontWeight: 400 }}>
            Hi, I am a...
          </h3>

          <div style={{ display: "flex", gap: "25px", justifyContent: "center" }}>
            <button
              onClick={handleEmployee}
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "2px solid white",
                background:
                  selected === "employee" ? "#f97316" : "transparent",
                color: "white",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
            >
              Employee
            </button>

            <button
              onClick={handleStudent}
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "2px solid white",
                background:
                  selected === "student" ? "#f97316" : "transparent",
                color: "white",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enterprise;