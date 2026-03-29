import { Route, Routes } from "react-router-dom";
import Courses from "../components/employee/Courses";
import Files from "../components/employee/Files";
import Folios from "../components/employee/Folios";
import Settings from "../components/employee/Settings";
import DashboardLayout from "../components/layout/DashboardLayout";



function EmployeeDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        {/* Default route */}
        <Route index element={<Files />} />
        <Route path="files" element={<Files />} />
        <Route path="folios" element={<Folios />} />
        <Route path="courses" element={<Courses />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}

export default EmployeeDashboard;