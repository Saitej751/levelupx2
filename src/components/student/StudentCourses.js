import { useCallback, useEffect, useState } from "react";

function StudentCourses() {

  const studentData = localStorage.getItem("student");
  const student = studentData ? JSON.parse(studentData) : null;

  const token = localStorage.getItem("token");

  console.log("Student object from localStorage:", student);
  console.log("Session token:", token);

  const studentId = student?.student_email;

  console.log("Student Email used for API:", studentId);

  const [courses, setCourses] = useState([]);

  // ===============================
  // TASK SYSTEM STATES
  // ===============================

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [answers, setAnswers] = useState({});

  // ===============================
  // FETCH COURSES
  // ===============================

  useEffect(() => {

    if (!studentId) {
      console.log("Student not found in localStorage");
      return;
    }

    if (!token) {
      console.log("Session token missing");
      return;
    }

    const fetchCourses = async () => {

      try {

        const url = `http://localhost:5000/student/${studentId}/courses`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error("Server error:", response.status);
          return;
        }

        const data = await response.json();

        console.log("Courses from API:", data);

        if (Array.isArray(data)) {

          const formattedCourses = data.map((course) => ({
            ...course,
            instructor: "Assigned Instructor",
            duration: "N/A",
            status: "Ongoing"
          }));

          setCourses(formattedCourses);
        }

      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();

  }, [studentId, token]);


  // ====================================
  // FETCH TASKS
  // ====================================

  const fetchTasks = async (courseId) => {

    try {

      const url = `http://localhost:5000/student/${studentId}/tasks/${courseId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error("Task API error:", response.status);
        return;
      }

      const data = await response.json();

      console.log("Tasks:", data);

      if (Array.isArray(data)) {

        // SORT TASKS BY QUESTION NUMBER (SAFE FRONTEND SORT)
        const sortedTasks = [...data].sort((a, b) =>
          (a.question_no || a.task_id) - (b.question_no || b.task_id)
        );

        setTasks(sortedTasks);
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  // ====================================
  // HANDLE ANSWER CHANGE
  // ====================================

  const handleAnswerChange = (taskId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [taskId]: value
    }));
  };


  // ====================================
  // SUBMIT TASK
  // ====================================

  const submitTask = useCallback(async (taskId) => {

    try {

      const response = await fetch("http://localhost:5000/student/submit-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: taskId,
          student_email: studentId,
          answer: answers[taskId]
        })
      });

      if (!response.ok) {
        console.error("Submit failed:", response.status);
        return;
      }

      alert("Task submitted successfully");

    } catch (error) {
      console.error("Submit error:", error);
    }

  }, [studentId, answers, token]);


  // ====================================
  // SECURITY FEATURES
  // ====================================

  useEffect(() => {

    const disableRightClick = (e) => e.preventDefault();
    const disableCopy = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("paste", disableCopy);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("paste", disableCopy);
    };

  }, []);


  // ====================================
  // TAB SWITCH DETECTION
  // ====================================

  useEffect(() => {

    const handleVisibilityChange = () => {

      if (document.hidden) {

        alert("Tab switch detected. Auto submitting tasks.");

        tasks.forEach((task) => {

          if (answers[task.task_id]) {
            submitTask(task.task_id);
          }

        });

      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, [tasks, answers, submitTask]);


  // ====================================
  // FULL SCREEN MODE
  // ====================================

  const enterFullScreen = () => {

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }

  };


  // ====================================
  // COURSE TASK VIEW
  // ====================================

  if (selectedCourse) {

    return (
      <div>

        <button
          onClick={() => {
            setSelectedCourse(null);
            setTasks([]);
          }}
          style={{
            marginBottom: "20px",
            background: "none",
            border: "none",
            color: "#f97316",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          ← Back to Courses
        </button>

        <button
          onClick={enterFullScreen}
          style={{
            marginBottom: "20px",
            padding: "10px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Start Exam Mode
        </button>

        <h2 style={{ marginBottom: "25px" }}>
          {selectedCourse.course_name} Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (

          tasks.map((task, index) => (

            <div
              key={task.task_id}
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "20px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
              }}
            >

              <h3>
                Question {task.question_no || index + 1}
              </h3>

              <p>{task.question}</p>

              <p style={{ fontSize: "13px", color: "#64748b" }}>
                Marks: {task.marks}
              </p>

              {/* LOCKED TASK */}

              {task.is_unlocked === false ? (

                <p style={{ color: "red", fontWeight: "600" }}>
                  🔒 Task locked by instructor
                </p>

              ) : (

                <>
                  <textarea
                    placeholder="Write your answer here..."
                    rows="6"
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1"
                    }}
                    onChange={(e) =>
                      handleAnswerChange(task.task_id, e.target.value)
                    }
                  />

                  <button
                    onClick={() => submitTask(task.task_id)}
                    style={{
                      marginTop: "12px",
                      padding: "10px 16px",
                      backgroundColor: "#f97316",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Submit Task
                  </button>
                </>

              )}

            </div>

          ))

        )}

      </div>
    );
  }


  // ====================================
  // COURSE LIST VIEW
  // ====================================

  return (

    <div>

      <h2 style={{ marginBottom: "30px" }}>
        Enrolled Courses
      </h2>

      {courses.length === 0 ? (

        <p>No courses assigned by employee.</p>

      ) : (

        courses.map((course) => (

          <div
            key={course.course_id}
            onClick={() => {
              setSelectedCourse(course);
              fetchTasks(course.course_id);
            }}
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "20px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}
          >

            <h3 style={{ marginBottom: "10px" }}>
              {course.course_name}
            </h3>

            <p style={{ marginBottom: "5px", color: "#475569" }}>
              Instructor: {course.instructor}
            </p>

            <p style={{ marginBottom: "5px", color: "#475569" }}>
              Duration: {course.duration}
            </p>

            <span
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: "#f97316",
                color: "white"
              }}
            >
              {course.status}
            </span>

          </div>

        ))

      )}

    </div>

  );
}

export default StudentCourses;