import { useEffect, useState } from "react";

function StudentSettings() {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/student/profile/${studentId}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setName(data.student.name);
          setEmail(data.student.email);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Failed to load profile ❌");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchProfile();
    }
  }, [studentId]);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("All fields are required ⚠️");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/student/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email })
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Profile updated successfully ✅");
      } else {
        setMessage("Update failed ❌");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Student Settings</h2>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "500px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
        }}
      >
        {/* Name Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "500" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1"
            }}
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "500" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1"
            }}
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{
            padding: "10px 18px",
            backgroundColor: loading ? "#94a3b8" : "#f97316",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Message */}
        {message && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              fontWeight: "500",
              color: message.includes("successfully")
                ? "green"
                : "red"
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentSettings;