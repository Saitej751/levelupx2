import { useEffect, useState } from "react";

function StudentTasks() {

  const studentData = localStorage.getItem("student");
  const student = studentData ? JSON.parse(studentData) : null;
  const studentEmail = student?.student_email;

  const token = localStorage.getItem("token");

  // ===============================
  // TASKS FROM SERVER
  // ===============================

  const [tasks, setTasks] = useState([]);

  // ===============================
  // FETCH TASKS CREATED BY EMPLOYEE
  // ===============================

  useEffect(() => {

    if (!studentEmail || !token) return;

    const fetchTasks = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/student/${studentEmail}/task-notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          console.log("Task API error");
          return;
        }

        const data = await response.json();

        console.log("Tasks from employees:", data);

        if (Array.isArray(data)) {
          setTasks(data);
        }

      } catch (error) {
        console.log("Task fetch error", error);
      }
    };

    fetchTasks();

  }, [studentEmail, token]);

  return (
    <div>

      <h2 style={{ marginBottom: "25px" }}>Student Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (

        tasks.map((task) => (

          <div
            key={task.task_id}
            style={{
              backgroundColor: "white",
              padding: "16px",
              marginBottom: "14px",
              borderRadius: "10px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
            }}
          >

            <h4 style={{ marginBottom: "6px" }}>
              {task.course_name}
            </h4>

            <p style={{ marginBottom: "6px", color: "#475569" }}>
              Instructor: {task.employee_email}
            </p>

            <p style={{ marginBottom: "6px" }}>
              Question: {task.question}
            </p>

            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Marks: {task.marks}
            </p>

            {task.is_unlocked ? (
              <span style={{ color: "green", fontWeight: "600" }}>
                🟢 Task Open
              </span>
            ) : (
              <span style={{ color: "red", fontWeight: "600" }}>
                🔒 Task Locked by Instructor
              </span>
            )}

          </div>

        ))

      )}

    </div>
  );
}

export default StudentTasks;