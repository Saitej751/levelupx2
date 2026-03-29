const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= POSTGRESQL CONNECTION ================= */

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "levelupx",
  password: "1234",
  port: 5432,
});

// Check DB connection properly
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release(); // release connection
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // stop server if DB fails
  });

/* ================= EMPLOYEE LOGIN ================= */

app.post("/api/employee-login", async (req, res) => {
  try {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      "SELECT * FROM employees WHERE employee_id = $1 AND password = $2",
      [employee_id, password]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
    console.error("Employee Login Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ================= STUDENT LOGIN ================= */

app.post("/api/student-login", async (req, res) => {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      "SELECT * FROM students WHERE student_id = $1 AND password = $2",
      [student_id, password]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
    console.error("Student Login Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ================= CREATE STUDENT ================= */

app.post("/api/create-student", async (req, res) => {
  try {
    const { student_id, name, email, password } = req.body;

    if (!student_id || !name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO students (student_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [student_id, name, email, password]
    );

    return res.json({
      success: true,
      message: "Student created successfully",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("Create Student Error:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Student ID or Email already exists",
      });
    }

    return res.status(500).json({ error: "Server error" });
  }
});

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {   
  res.send("🚀 LevelUpX Backend Server Running");
});

/* ================= ERROR HANDLING ================= */

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

/* ================= START SERVER ================= */

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});