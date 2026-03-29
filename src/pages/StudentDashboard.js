import { Route, Routes } from "react-router-dom";

import StudentDashboardLayout from "../components/layout/StudentDashboardLayout";

import StudentCourses from "../components/student/StudentCourses";
import StudentFiles from "../components/student/StudentFiles";
import StudentProgress from "../components/student/StudentProgress";
import StudentSettings from "../components/student/StudentSettings";
import StudentTasks from "../components/student/StudentTasks";

function StudentDashboard() {
  return (
    <StudentDashboardLayout>
      <Routes>
        <Route index element={<StudentFiles />} />
        <Route path="files" element={<StudentFiles />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="tasks" element={<StudentTasks />} />
      </Routes>
    </StudentDashboardLayout>
  );
}

export default StudentDashboard;