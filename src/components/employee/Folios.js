import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function Folios() {
  const [name, setName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 NEW STATES (ADDED)
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState(null);

  const employee = JSON.parse(localStorage.getItem("employee"));
  const employeeEmail = employee?.email;

  // ===========================
  // FETCH FOLIOS
  // ===========================
const fetchFolios = useCallback(async () => {
  if (!employeeEmail) return;

  try {
    const res = await axios.get(
      `http://levelupx2-backend.onrender.com/employee/folios/${employeeEmail}`
    );
    setFolios(res.data);
  } catch (error) {
    console.error("Fetch folios error:", error);
  }
}, [employeeEmail]);

useEffect(() => {
  fetchFolios();
}, [fetchFolios]);

  // ===========================
  // CREATE FOLIO (YOUR ORIGINAL)
  // ===========================
  const handleCreate = async () => {
    try {
      if (!employeeEmail) {
        setMessage("Employee not logged in ❌");
        return;
      }

      if (!studentEmail || !password) {
        setMessage("Student Email and Password are required ❌");
        return;
      }

      const response = await axios.post(
        "http://levelupx2-backend.onrender.com/employee/folios",
        {
          employee_email: employeeEmail,
          name: name,
          student_email: studentEmail,
          password: password
        }
      );

      if (response.data.status === "success") {
        setMessage("Student Created Successfully ✅");
        setName("");
        setStudentEmail("");
        setPassword("");
        fetchFolios(); // 🔥 refresh list
      } else {
        setMessage(response.data.message || "Failed ❌");
      }

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error creating student ❌"
      );
    }
  };

  // ===========================
  // DELETE FOLIO
  // ===========================
  const handleDelete = async () => {
    if (!selectedFolio) {
      setMessage("Select a folio to delete ❌");
      return;
    }

    try {
      await axios.post(
        "http://levelupx2-backend.onrender.com/employee/delete-folio",
        {
          employee_email: employeeEmail,
          student_email: selectedFolio
        }
      );

      setMessage("Folio Deleted Successfully 🗑️");
      setSelectedFolio(null);
      fetchFolios();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting folio ❌");
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px" }}>
      
      {/* ================= LEFT SIDE (YOUR ORIGINAL FORM) ================= */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: "30px" }}>Create Student (Folio)</h2>

        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "500px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label>Employee Email</label>
            <input
              type="text"
              value={employeeEmail || ""}
              readOnly
              style={inputReadonly}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Student Email</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button style={buttonStyle} onClick={handleCreate}>
            Create Student
          </button>

          {message && (
            <p style={{ marginTop: "15px", fontSize: "14px" }}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE (NEW SCROLLABLE LIST) ================= */}
      <div style={{ flex: 1 }}>
        <h2>Created Folios</h2>

        <div style={scrollBox}>
          {folios.map((folio, index) => (
            <div
              key={index}
              onClick={() => setSelectedFolio(folio.student_email)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor:
                  selectedFolio === folio.student_email
                    ? "#f97316"
                    : "#f1f5f9",
                color:
                  selectedFolio === folio.student_email
                    ? "white"
                    : "black"
              }}
            >
              {folio.student_email}
            </div>
          ))}
        </div>

        <button
          onClick={handleDelete}
          style={{
            ...buttonStyle,
            marginTop: "15px",
            backgroundColor: "#ef4444"
          }}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1"
};

const inputReadonly = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f1f5f9"
};

const buttonStyle = {
  padding: "10px 18px",
  backgroundColor: "#f97316",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const scrollBox = {
  maxHeight: "350px",
  overflowY: "auto",
  paddingRight: "10px"
};

export default Folios;