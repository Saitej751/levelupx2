import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function Files({ courseId }) {

  // 🔥 KEEPING YOUR EXISTING STATE
  const [files, setFiles] = useState([
    { id: 1, name: "Student_Report.pdf" },
    { id: 2, name: "Course_Structure.docx" }
  ]);

 

  // 🔥 NEW STATE FOR REAL FILE
  const [selectedFile, setSelectedFile] = useState(null);

  // ===========================
  // FETCH FILES FROM BACKEND
  // ===========================


  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/course/${courseId}/files`
      );

      if (Array.isArray(res.data)) {
        const formattedFiles = res.data.map((file, index) => ({
          id: index + 1,
          name: file.file_name
        }));

        setFiles(formattedFiles);
      }
    } catch (err) {
      console.log("Error fetching files", err);
    }
  }, [courseId]);
   
  useEffect(() => {
    if (courseId) {
      fetchFiles();
    }
  }, [courseId, fetchFiles]);

  // ===========================
  // UPLOAD FILE TO BACKEND
  // ===========================
  const handleAddFile = async () => {

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("course_id", courseId);

    try {
      await axios.post(
        "http://localhost:5000/course/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("File uploaded successfully");

      setSelectedFile(null);
     

      fetchFiles();  // refresh list
    } catch (err) {
      console.log("Upload error", err);
      alert("Upload failed");
    }
  };

  // ===========================
  // DELETE (Frontend Only for Now)
  // ===========================
  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div>
      <h2 style={{ marginBottom: "25px" }}>Files</h2>

      {/* ===== Add File Section ===== */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "10px"
        }}
      >
        {/* 🔥 REAL FILE INPUT ADDED */}
        <input
          type="file"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
            
          }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "14px"
          }}
        />

        <button
          onClick={handleAddFile}
          style={{
            padding: "10px 16px",
            backgroundColor: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Add File
        </button>
      </div>

      {/* ===== File List ===== */}
      <div>
        {files.length === 0 ? (
          <p style={{ color: "#000000" }}>No files available</p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px",
                marginBottom: "14px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
              }}
            >
              <a
                href={`http://localhost:5000/uploads/${file.name}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: "14px",
                  textDecoration: "none"
                }}
              >
                {file.name}
              </a>

              <button
                onClick={() => handleDelete(file.id)}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Files;