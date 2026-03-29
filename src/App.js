import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Enterprise from "./pages/Enterprise";
import Home from "./pages/Home";


import EmployeeLogin from "./pages/EmployeeLogin";
import StudentLogin from "./pages/StudentLogin";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import StudentDashboard from "./pages/StudentDashboard";


// ================= PROTECTED ROUTE =================
function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const student = localStorage.getItem("student");
  const employee = localStorage.getItem("employee");

  // if no token → redirect to home
  if (!token) {
    return <Navigate to="/" />;
  }

  // role based protection
  if (role === "student" && !student) {
    return <Navigate to="/StudentLogin" />;
  }

  if (role === "employee" && !employee) {
    return <Navigate to="/EmployeeLogin" />;
  }

  return children;
}


function App() {
  return (
    <Router>
      <Routes>

        {/* ================= HOME ================= */}
        <Route path="/" element={<Home />} />


        {/* ================= ENTERPRISE ================= */}
        <Route path="/enterprise" element={<Enterprise />} />

        {/* ================= LOGIN ================= */}
        <Route path="/EmployeeLogin" element={<EmployeeLogin />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />

        {/* ================= DASHBOARDS ================= */}

        <Route
          path="/EmployeeDashboard/*"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/StudentDashboard/*"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;