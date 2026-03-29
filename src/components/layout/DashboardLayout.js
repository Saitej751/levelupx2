import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const switchTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
  };

  const isDark = theme === "dark";

  // ✅ Detect role
  const employee = localStorage.getItem("employee");
  const student = localStorage.getItem("student");

  const role = employee ? "employee" : student ? "student" : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
        transition: "0.3s"
      }}
    >
      <Header theme={theme} switchTheme={switchTheme} role={role} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* ✅ Pass role to Sidebar */}
        <Sidebar theme={theme} role={role} />

        <div
          style={{
            flex: 1,
            padding: "50px",
            backgroundColor: isDark ? "#1e293b" : "#f8fafc",
            transition: "0.3s"
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? "#334155" : "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              minHeight: "80vh",
              color: isDark ? "white" : "#1e293b",
              transition: "0.3s"
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;