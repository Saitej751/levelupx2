import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const employee_id = localStorage.getItem("employee_id");

  const handleUpdateProfile = async () => {
    try {
      await axios.put("http://levelupx2-backend.onrender.com/employee/update-profile", {
        employee_id,
        name
      });

      alert("Profile updated successfully");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put("http://levelupx2-backend.onrender.com/employee/change-password", {
        employee_id,
        password: newPassword
      });

      alert("Password changed successfully");
      setNewPassword("");
    } catch (error) {
      alert("Error changing password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee_id");
    navigate("/employee-login");
  };

  return (
    <div>
      <h2>Settings</h2>

      <h3>Update Profile</h3>
      <input
        type="text"
        placeholder="New Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />
      <button onClick={handleUpdateProfile}>Update Profile</button>

      <hr style={{ margin: "30px 0" }} />

      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleChangePassword}>Change Password</button>

      <hr style={{ margin: "30px 0" }} />

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#f97316",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Settings;