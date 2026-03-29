import { useCallback, useEffect, useState } from "react";

function StudentProgress() {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.student_email;

  const [progressData, setProgressData] = useState([]);

  const fetchProgress = useCallback(async () => {
    const response = await fetch(
      `http://localhost:5000/student/progress/${studentId}`
    );
    const data = await response.json();

    if (data.status === "success") {
      setProgressData(data.progress);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchProgress();
    }
  }, [studentId, fetchProgress]);

  const calculateAverage = () => {
    if (progressData.length === 0) return 0;
    const total = progressData.reduce(
      (sum, item) => sum + item.progress_percent,
      0
    );
    return Math.round(total / progressData.length);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Student Progress</h2>

      {progressData.length === 0 ? (
        <p>No progress data available.</p>
      ) : (
        <>
          {/* Overall Progress */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
            }}
          >
            <h3>Overall Completion</h3>
            <div
              style={{
                height: "20px",
                backgroundColor: "#e2e8f0",
                borderRadius: "10px",
                marginTop: "10px"
              }}
            >
              <div
                style={{
                  width: `${calculateAverage()}%`,
                  height: "100%",
                  backgroundColor: "#f97316",
                  borderRadius: "10px",
                  transition: "0.4s"
                }}
              />
            </div>
            <p style={{ marginTop: "10px", fontWeight: "600" }}>
              {calculateAverage()}%
            </p>
          </div>

          {/* Individual Courses */}
          {progressData.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
              }}
            >
              <h4>{item.course_name}</h4>

              <div
                style={{
                  height: "15px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "10px",
                  marginTop: "10px"
                }}
              >
                <div
                  style={{
                    width: `${item.progress_percent}%`,
                    height: "100%",
                    backgroundColor: "#2563eb",
                    borderRadius: "10px",
                    transition: "0.4s"
                  }}
                />
              </div>

              <p style={{ marginTop: "8px", fontWeight: "500" }}>
                {item.progress_percent}% Completed
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default StudentProgress;