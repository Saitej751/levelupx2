import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Files", path: "files" },
  { name: "Courses", path: "courses" },
  { name: "Progress", path: "progress" },
  { name: "Settings", path: "settings" },
  { name: "tasks", path: "tasks"},
];

function StudentSidebar({ theme }) {
  const isDark = theme === "dark";

  const basePath = "/StudentDashboard";

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
        transition: "0.3s"
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>Student Panel</h2>

      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={`${basePath}/${item.path}`}
          style={({ isActive }) => ({
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "10px",
            textDecoration: "none",
            color: "white",
            backgroundColor: isActive
              ? isDark
                ? "#334155"
                : "#1e293b"
              : "transparent",
            fontWeight: isActive ? "600" : "400",
            transition: "0.3s"
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default StudentSidebar;