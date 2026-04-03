import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function Courses() {

  const [selectedCourse, setSelectedCourse] = useState(null);
  // eslint-disable-next-line
  const [openSection, setOpenSection] = useState(null);

  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [employeeEmail, setEmployeeEmail] = useState(
    localStorage.getItem("employee_email") || ""
  );
// eslint-disable-next-line
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMarks, setTaskMarks] = useState("");

  const [allowCopyPaste, setAllowCopyPaste] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [examMode, setExamMode] = useState(false);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [tasks, setTasks] = useState([]);

  // ================= FETCH COURSES =================

  const fetchCourses = useCallback(async () => {

    try {

      const res = await axios.get(
        `http://levelupx2-backend.onrender.com/employee/${employeeEmail}/courses`
      );

      if (res.data.courses) {
        setCourses(res.data.courses);
      }

    } catch (err) {

      console.log("Error fetching courses", err);

    }

  }, [employeeEmail]);

  // ================= FETCH STUDENTS =================

  const fetchStudents = useCallback(async () => {

    try {

      const res = await axios.get(
        `http://levelupx2-backend.onrender.com/employee/folios/${employeeEmail}`
      );

      setStudents(res.data);

    } catch (err) {

      console.log("Fetch students error", err);

    }

  }, [employeeEmail]);

  // ================= FETCH TASKS =================

  const fetchTasks = async (courseId) => {

    try {

      const res = await axios.get(
        `http://levelupx2-backend.onrender.com/employee/tasks/${courseId}`
      );

      setTasks(res.data);

    } catch (err) {

      console.log("Fetch tasks error", err);

    }

  };

  // ================= UNLOCK TASK =================

  const unlockTask = async (taskId) => {

    try {

      await axios.put(
        `http://levelupx2-backend.onrender.com/employee/unlock-task/${taskId}`
      );

      fetchTasks(selectedCourse.course_id);

    } catch (err) {

      console.log("Unlock task error", err);

    }

  };

  // ================= LOCK TASK =================

  const lockTask = async (taskId) => {

    try {

      await axios.put(
        `http://levelupx2-backend.onrender.com/employee/lock-task/${taskId}`
      );

      fetchTasks(selectedCourse.course_id);

    } catch (err) {

      console.log("Lock task error", err);

    }

  };

  // ================= DELETE TASK =================

  const deleteTask = async (taskId) => {

    if (!window.confirm("Delete this task?")) return;

    try {

      await axios.delete(
        `http://levelupx2-backend.onrender.com/employee/delete-task/${taskId}`
      );

      // update UI instantly
      setTasks((prev) => prev.filter((task) => task.task_id !== taskId));

    } catch (err) {

      console.log("Delete task error", err);

    }

  };

  useEffect(() => {

    if (employeeEmail) {

      fetchCourses();
      fetchStudents();

    }

  }, [employeeEmail, fetchCourses, fetchStudents]);

  // ================= CREATE COURSE =================

  const handleCreateCourse = async () => {

    try {

      const res = await axios.post(
        "http://levelupx2-backend.onrender.com/employee/courses",
        {
          employee_email: employeeEmail,
          course_name: courseTitle
        }
      );

      if (res.data.status === "success") {

        setCourseTitle("");
        setCourseDescription("");

        fetchCourses();

      }

    } catch (err) {

      console.log("Create course error", err);

    }

  };

  const toggleStudent = (email) => {

    if (selectedStudents.includes(email)) {

      setSelectedStudents(selectedStudents.filter((s) => s !== email));

    } else {

      setSelectedStudents([...selectedStudents, email]);

    }

  };

  // ================= CREATE TASK =================

  const createTask = async () => {

    try {

      const res = await axios.post(
        "http://levelupx2-backend.onrender.com/employee/create-task",
        {
          course_id: selectedCourse.course_id,
          question: taskDescription,
          marks: taskMarks,
          allow_copy_paste: allowCopyPaste,
          allow_tab_switch: autoSubmit,
          exam_mode: examMode,
          students: selectedStudents
        }
      );

      if (res.data.status === "success") {

        setTaskTitle("");
        setTaskDescription("");
        setTaskMarks("");
        setSelectedStudents([]);

        fetchTasks(selectedCourse.course_id);

      }

    } catch (err) {

      console.log("Create task error", err);

    }

  };

  // ================= COURSE LIST VIEW =================

  if (!selectedCourse) {

    return (

      <div>

        <div style={container}>

          <h2>Create Course</h2>

          <input
            placeholder="Employee Email"
            style={inputStyle}
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
          />

          <input
            placeholder="Course Title"
            style={inputStyle}
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />

          <textarea
            placeholder="Course Description"
            rows="3"
            style={inputStyle}
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />

          <button style={buttonStyle} onClick={handleCreateCourse}>
            Create Course
          </button>

          <hr style={{ margin: "25px 0" }} />

          <h3>Recent Courses</h3>

          {courses.map((course) => (

            <div
              key={course.course_id}
              onClick={() => {

                setSelectedCourse(course);
                fetchTasks(course.course_id);

              }}
              style={courseCard}
            >

              {course.course_name}

            </div>

          ))}

        </div>

      </div>

    );

  }

  // ================= COURSE DASHBOARD =================

  return (

    <div>

      <button onClick={() => setSelectedCourse(null)}>
        ← Back
      </button>

      <h2 style={{ marginBottom: "25px" }}>
        {selectedCourse.course_name} Course
      </h2>

      <div style={gridLayout}>

        {/* CREATE TASK PANEL */}

        <div style={card}>

          <h3>Create Task</h3>

          <textarea
            placeholder="Task Question"
            rows="4"
            style={inputStyle}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <input
            placeholder="Marks"
            type="number"
            style={inputStyle}
            value={taskMarks}
            onChange={(e) => setTaskMarks(e.target.value)}
          />

          <h4>Security Mode</h4>

          <div style={verticalBox}>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={allowCopyPaste}
                onChange={() => setAllowCopyPaste(!allowCopyPaste)}
              />
              Allow Copy Paste
            </label>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={autoSubmit}
                onChange={() => setAutoSubmit(!autoSubmit)}
              />
              Auto Submit on Tab Switch
            </label>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={examMode}
                onChange={() => setExamMode(!examMode)}
              />
              Full Screen Exam Mode
            </label>

          </div>

          <h4>Select Allowed Students</h4>

          <div style={studentBox}>

            {students.map((student) => (

              <label
                key={student.student_email}
                style={checkboxLabel}
              >

                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.student_email)}
                  onChange={() => toggleStudent(student.student_email)}
                />

                {student.student_email}

              </label>

            ))}

          </div>

          <button style={buttonStyle} onClick={createTask}>
            Create Task
          </button>

        </div>

        {/* RECENT ACTIVITIES */}

        <div style={card}>

          <h3>Recent Activities</h3>

          {tasks.map((task, index) => (

            <div key={task.task_id} style={activityCard}>

              <strong>Q{index + 1}. {task.question}</strong>

              <p>Marks: {task.marks}</p>

              <p>
                Status: {task.is_unlocked ? "🟢 Unlocked" : "🔒 Locked"}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* TASK TABLE */}

      <div style={{ ...card, marginTop: "25px" }}>

        <h3>Course Tasks</h3>

        <table style={tableStyle}>

          <thead>

            <tr>

              <th>Question</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {tasks.map((task, index) => (

              <tr key={task.task_id}>

                <td>Q{index + 1}. {task.question}</td>

                <td>{task.marks}</td>

                <td>
                  {task.is_unlocked ? "Unlocked" : "Locked"}
                </td>

                <td>

                  {task.is_unlocked ? (

                    <button
                      onClick={() => lockTask(task.task_id)}
                      style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
                    >
                      Lock
                    </button>

                  ) : (

                    <button
                      onClick={() => unlockTask(task.task_id)}
                      style={buttonStyle}
                    >
                      Unlock
                    </button>

                  )}

                  <button
                    onClick={() => deleteTask(task.task_id)}
                    style={{ ...buttonStyle, marginLeft: "8px", backgroundColor: "#dc2626" }}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

// ================= STYLES =================

const container = {
  background: "white",
  padding: "30px",
  borderRadius: "20px"
};

const gridLayout = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
};

const courseCard = {
  background: "#f97316",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "10px",
  color: "white",
  cursor: "pointer"
};

const activityCard = {
  border: "1px solid #e2e8f0",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1"
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f97316",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const verticalBox = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "15px"
};

const studentBox = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  border: "1px solid #e2e8f0",
  padding: "10px",
  borderRadius: "8px",
  maxHeight: "150px",
  overflowY: "auto",
  marginBottom: "15px"
};

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

export default Courses;