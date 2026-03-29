import { useCallback, useEffect, useState } from "react";

function StudentFiles() {
  const [files, setFiles] = useState([]);

  // 🔥 get selected course from localStorage (set when student clicks course)
  const course = JSON.parse(localStorage.getItem("selectedCourse"));
  const courseId = course?.course_id;

  const fetchFiles = useCallback( async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/student/course/${courseId}/files`
      );

      const data = await response.json();

      // 🔥 backend returns array of files
      if (Array.isArray(data)) {
        setFiles(data);
      }

      // keeping your original condition also
      if (data.status === "success") {
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  },[courseId]);

  useEffect(() => {
    if (courseId) {
      fetchFiles();
    }
  }, [courseId, fetchFiles]);

  // 🔥 download function added
  const handleDownload = (fileId) => {
    window.open(`http://localhost:5000/download/${fileId}`, "_blank");
  };

  return (
    <div>
      <h2 style={{ marginBottom: "25px" }}>Available Files</h2>

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id || file.file_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px",
              marginBottom: "14px",
              backgroundColor: "white",
              borderRadius: "10px",
              color: "black"
            }}
          >
            <span>{file.filename || file.file_name}</span>

            <span style={{ fontSize: "12px", color: "gray" }}>
              {file.uploaded_at
                ? new Date(file.uploaded_at).toLocaleString()
                : ""}
            </span>

            {/* 🔥 download button added */}
            <button
              onClick={() => handleDownload(file.id || file.file_id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f97316",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentFiles;