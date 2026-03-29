import { NavLink } from "react-router-dom";

function Sidebar({ theme }) {
  const isDark = theme === "dark";

  const employee = localStorage.getItem("employee");
  const Student = localStorage.getItem("Student");

  const role = employee ? "employee" : Student ? "Student" : null;

  // 🔥 Dynamic Menu Based on Role
  const menuItems =
    role === "employee"
      ? [
          { name: "Files", path: "files" },
          { name: "Folios", path: "folios" },
          { name: "Courses", path: "courses" },
          { name: "Settings", path: "settings" },
        ]
      : [
          { name: "Courses", path: "courses" },
          { name: "Files", path: "files" },
          { name: "Tasks", path: "tasks" },
          { name: "Progress", path: "progress" },
          { name: "Settings", path: "settings" },
        ];

  const basePath =
    role === "employee" ? "/EmployeeDashboard" : "/StudentDashboard";

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: isDark ? "#1e293b" : "#0f172a",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        boxShadow: "2px 0 15px rgba(0,0,0,0.15)",
        transition: "0.3s ease"
      }}
    >
      {/* 🔥 Dynamic Title */}
      <h2
        style={{
          marginBottom: "40px",
          fontWeight: "600",
          fontSize: "20px",
          letterSpacing: "1px",
          color: "white"
        }}
      >
        {role === "employee" ? "Employee Panel" : "Student Panel"}
      </h2>

      {/* 🔥 Menu Items */}
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={`${basePath}/${item.path}`}
          style={({ isActive }) => ({
            padding: "14px 16px",
            marginBottom: "15px",
            borderRadius: "12px",
            textDecoration: "none",
            color: isActive ? "#f97316" : "#e2e8f0",
            backgroundColor: isActive
              ? "rgba(249, 115, 22, 0.12)"
              : "transparent",
            fontWeight: isActive ? "600" : "400",
            transition: "all 0.3s ease",
            transform: isActive ? "translateX(5px)" : "translateX(0px)"
          })}
          onMouseEnter={(e) => {
            if (!e.target.classList.contains("active")) {
              e.target.style.backgroundColor = isDark
                ? "#334155"
                : "#1e293b";
              e.target.style.color = "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.classList.contains("active")) {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#e2e8f0";
            }
          }}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;