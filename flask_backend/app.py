from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
import psycopg2.extras
from config import Config
import os
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# ================= DATABASE CONNECTION =================

def get_db_connection():
    try:
        print("Starting to establish connection....")
        conn = psycopg2.connect(
            host="localhost",
            database="levelupx",
            user="postgres",
            password="1234",
            port=5050
        )
        print("Connection successful....")
        return conn
    except Exception as e:
        print("Database connection error:", e)
        return None


# ================= HOME ROUTE =================

@app.route("/")
def home():
    return jsonify({"message": "LevelUpX Flask Backend Running"})


# ======================================================
# ================= STUDENT LOGIN ======================
# ======================================================


@app.route("/student/login", methods=["POST"])
def student_login():
    try:

        data = request.get_json(force=True)

        student_email = data.get("email")
        password = data.get("password")

        print("Login attempt:", student_email)

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cur.execute(
            "SELECT * FROM students WHERE student_email=%s",
            (student_email,)
        )

        user = cur.fetchone()

        cur.close()
        conn.close()

        if user and password == user["password"]:

            # ===============================
            # SESSION TOKEN GENERATION
            # ===============================

            session_token = str(uuid.uuid4())

            print("Login success:", student_email)
            print("Session token:", session_token)

            return jsonify({
                "status": "success",
                "token": session_token,   # NEW TOKEN ADDED
                "user": {
                    "student_email": user["student_email"],
                    "name": user["name"]
                }
            })

        else:

            print("Login failed for:", student_email)

            return jsonify({
                "status": "fail",
                "message": "Invalid credentials"
            }), 401

    except Exception as e:

        print("Student login error:", e)

        return jsonify({
            "status": "fail",
            "message": "Server error"
        }), 500


# ======================================================
# ================= EMPLOYEE LOGIN =====================
# ======================================================

@app.route("/employee/login", methods=["POST"])
def employee_login():
    try:

        data = request.get_json(force=True)

        employee_email = data.get("employee_email")
        password = data.get("password")

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cur.execute(
            "SELECT * FROM employees WHERE employee_email=%s",
            (employee_email,)
        )

        user = cur.fetchone()

        cur.close()
        conn.close()

        if user and password == user["password"]:
            return jsonify({
                "status": "success",
                "user": {
                    "email": user["employee_email"],
                    "name": user["name"]
                }
            })
        else:
            return jsonify({"status": "fail"}), 401

    except Exception as e:
        print("Employee login error:", e)
        return jsonify({"status": "fail"}), 500


# ======================================================
# ============= CREATE STUDENT + FOLIO =================
# ======================================================

@app.route("/employee/folios", methods=["POST"])
def create_folio():
    print("POST /employee/folios called")
    try:
        data = request.get_json(force=True)
        print("Received folio data:", data)

        employee_email = data.get("employee_email")
        student_email = data.get("student_email")
        password = data.get("password")
        name = data.get("name") or student_email
        title = data.get("title")

        if not employee_email or not student_email or not password:
            return jsonify({
                "status": "fail",
                "message": "Missing required fields"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # 1️⃣ Create student if not exists
        print("student email is working")
        cur.execute(
            "SELECT student_email FROM students WHERE student_email=%s",
            (student_email,)
        )

        if not cur.fetchone():
            cur.execute(
                """
                INSERT INTO students (name, student_email, password)
                VALUES (%s, %s, %s)
                """,
                (name, student_email, password)
            )

        # 2️⃣ Assign employee-student relationship
        print("Inserting into folios:", employee_email, student_email)

        cur.execute(
            """
            INSERT INTO employee_students (employee_email, student_email)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """,
            (employee_email, student_email)
        )

        # 🔧 FIX ADDED HERE (password inserted into folios)
        cur.execute(
            """
            INSERT INTO folios (employee_email, student_email, password)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
            """,
            (employee_email, student_email, password)
        )

        # 3️⃣ Create folio title if provided
        if title:
            cur.execute(
                """
                INSERT INTO folios (employee_email, student_email, title, password)
                VALUES (%s, %s, %s, %s)
                """,
                (employee_email, student_email, title, password)
            )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Student + Folio created successfully"
        })

    except Exception as e:
        print("Create folio error:", e)
        return jsonify({"status": "fail", "message": "Server error"}), 500


# ======================================================
# ========= GET STUDENTS OF AN EMPLOYEE ===============
# ======================================================

@app.route("/employee/<employee_email>/courses", methods=["GET"])
def get_employee_courses(employee_email):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT course_id, title
            FROM courses
            WHERE employee_email = %s
        """, (employee_email,))

        courses = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({
            "courses": [
                {
                    "course_id": c[0],
                    "course_name": c[1]
                }
                for c in courses
            ]
        })

    except Exception as e:
        print("Fetch employee courses error:", e)
        return jsonify({"status": "fail"}), 500


# ======================================================
# ================= CREATE COURSE ======================
# ======================================================

@app.route("/employee/courses", methods=["POST"])
def create_course():

    try:

        data = request.get_json(force=True)

        employee_email = data.get("employee_email")
        title = data.get("title") or data.get("course_name")

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO courses (title, employee_email)
            VALUES (%s,%s)
            RETURNING course_id
            """,
            (title, employee_email)
        )

        course_id = cur.fetchone()[0]

        cur.execute(
            "SELECT student_email FROM employee_students WHERE employee_email=%s",
            (employee_email,)
        )

        students = cur.fetchall()

        for student in students:
            cur.execute(
                "INSERT INTO student_courses (student_email, course_id) VALUES (%s,%s)",
                (student[0], course_id)
            )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "success", "course_id": course_id})

    except Exception as e:
        print("Create course error:", e)
        return jsonify({"status": "fail"}), 500
    

@app.route("/employee/add-task", methods=["POST"])
def add_task():

    try:

        data = request.get_json(force=True)

        # ✅ Added safety defaults (nothing removed)
        course_id = data.get("course_id")

        question = data.get("question")
        if not question:
            question = None   # allow NULL

        marks = data.get("marks")
        if marks is None:
            marks = None     # allow NULL

        allow_tab_switch = data.get("allow_tab_switch")
        if allow_tab_switch is None:
            allow_tab_switch = False

        allow_copy_paste = data.get("allow_copy_paste")
        if allow_copy_paste is None:
            allow_copy_paste = False

        # ✅ NEW (exam mode)
        exam_mode = data.get("exam_mode")
        if exam_mode is None:
            exam_mode = False

        # ✅ NEW (allowed students list)
        students = data.get("students")
        if students is None:
            students = []


        conn = get_db_connection()
        cur = conn.cursor()

        # ======================================================
        # GET NEXT QUESTION NUMBER
        # ======================================================

        cur.execute(
            """
            SELECT COALESCE(MAX(question_no),0) + 1
            FROM course_tasks
            WHERE course_id = %s
            """,
            (course_id,)
        )

        question_no = cur.fetchone()[0]


        # ======================================================
        # INSERT TASK
        # ======================================================

        cur.execute("""
        INSERT INTO course_tasks
        (
            course_id,
            question,
            marks,
            question_no,
            allow_tab_switch,
            allow_copy_paste,
            exam_mode,
            is_unlocked
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,FALSE)
        RETURNING task_id
        """,
        (
            course_id,
            question,
            marks,
            question_no,
            allow_tab_switch,
            allow_copy_paste,
            exam_mode
        ))

        task_id = cur.fetchone()[0]


        # ======================================================
        # INSERT ALLOWED STUDENTS
        # ======================================================

        for student_email in students:

            cur.execute(
                """
                INSERT INTO task_allowed_students
                (task_id, student_email)
                VALUES (%s,%s)
                """,
                (task_id, student_email)
            )


        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "success", "task_id": task_id})

    except Exception as e:
        print("Add task error:", e)
        return jsonify({"status": "fail"}), 500
    

# ======================================================
# ================= CREATE TASK (ALIAS) ================
# ======================================================

@app.route("/employee/create-task", methods=["POST"])
def create_task_alias():
    return add_task()


# ======================================================
# ================= ASSIGN TASK ========================
# ======================================================

@app.route("/employee/assign-task", methods=["POST"])
def assign_task():

    try:

        data = request.get_json(force=True)

        conn = get_db_connection()
        cur = conn.cursor()

        for email in data.get("student_emails"):
            cur.execute(
                """
                INSERT INTO task_allowed_students (task_id, student_email)
                VALUES (%s,%s)
                """,
                (data.get("task_id"), email)
            )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "assigned"})

    except Exception as e:
        print("Assign error:", e)
        return jsonify({"status": "fail"}), 500


# ======================================================
# ================= DELETE TASK ========================
# ======================================================

@app.route("/employee/delete-task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        # First delete allowed students linked to this task
        cur.execute(
            """
            DELETE FROM task_allowed_students
            WHERE task_id = %s
            """,
            (task_id,)
        )

        # Then delete the task
        cur.execute(
            """
            DELETE FROM course_tasks
            WHERE task_id = %s
            """,
            (task_id,)
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "success"})

    except Exception as e:

        print("Delete task error:", e)
        return jsonify({"status": "fail"}), 500
# ======================================================
# ================= GET STUDENT COURSES ================
# ======================================================

@app.route("/student/<student_email>/courses", methods=["GET"])
def get_student_courses(student_email):

    try:
        print("Fetching courses for:", student_email)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT c.course_id, c.title
        FROM courses c
        JOIN student_courses sc
        ON c.course_id = sc.course_id
        WHERE sc.student_email = %s
        """, (student_email,))

        courses = cur.fetchall()

        print("Courses fetched:", courses)

        result = []

        for course in courses:
            result.append({
                "course_id": course[0],
                "course_name": course[1]   # keeping this same so React doesn't break
            })

        cur.close()
        conn.close()

        return jsonify(result)

    except Exception as e:
        print("Fetch student courses error:", e)
        return jsonify([])
# ======================================================
# ================= GET TASKS FOR STUDENT ==============
# ======================================================

@app.route("/student/<student_email>/tasks/<course_id>", methods=["GET"])
def get_tasks(course_id, student_email):

    try:

        print("Fetching tasks for student:", student_email, "course:", course_id)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT t.task_id, t.question, t.marks,
                   t.allow_tab_switch, t.allow_copy_paste,
                   t.is_unlocked
            FROM course_tasks t
            JOIN student_courses sc
            ON t.course_id = sc.course_id
            WHERE sc.student_email=%s
            AND t.course_id=%s
            ORDER BY t.question_no
            """,
            (student_email, course_id)
        )

        tasks = cur.fetchall()

        print("Tasks fetched:", tasks)

        cur.close()
        conn.close()

        return jsonify([
            {
                "task_id": t[0],
                "question": t[1],
                "marks": t[2],
                "allow_tab_switch": t[3],
                "allow_copy_paste": t[4],
                "is_unlocked": t[5]   # NEW FIELD
            }
            for t in tasks
        ])

    except Exception as e:
        print("Fetch tasks error:", e)
        return jsonify([])

@app.route("/employee/unlock-task/<int:task_id>", methods=["PUT"])
def unlock_task(task_id):

    try:
        print("Unlock request for task:", task_id)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
        UPDATE course_tasks
        SET is_unlocked = TRUE
        WHERE task_id = %s
        """, (task_id,))

        conn.commit()

        print("Task unlocked successfully")

        cur.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Task unlocked successfully"
        })

    except Exception as e:

        print("Unlock task error:", e)

        return jsonify({
            "status": "error",
            "message": "Failed to unlock task"
        }), 500

@app.route("/student/<student_email>/task-notifications")
def student_notifications(student_email):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        print("Fetching task notifications for:", student_email)

        cur.execute("""
        SELECT t.task_id, c.title, c.employee_email
        FROM course_tasks t
        JOIN courses c ON t.course_id = c.course_id
        JOIN student_courses sc ON sc.course_id = c.course_id
        WHERE sc.student_email = %s
        ORDER BY t.task_id DESC
        """, (student_email,))

        rows = cur.fetchall()

        print("Notification rows:", rows)

        cur.close()
        conn.close()

        return jsonify([
            {
                "task_id": r[0],
                "course_name": r[1],   # sending title as course_name to frontend
                "employee_email": r[2]
            }
            for r in rows
        ])

    except Exception as e:

        print("Student notification error:", e)

        return jsonify([])
# ======================================================
# ================= SUBMIT TASK ========================
# ======================================================

@app.route("/task/submit", methods=["POST"])
def submit_task():

    try:

        data = request.get_json(force=True)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO task_submissions (task_id, student_email, answer)
            VALUES (%s,%s,%s)
            """,
            (
                data.get("task_id"),
                data.get("student_email"),
                data.get("answer")
            )
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "submitted"})

    except Exception as e:
        print("Submit error:", e)
        return jsonify({"status": "fail"}), 500


# ======================================================
# ================= FILE UPLOAD ========================
# ======================================================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/course/upload-file", methods=["POST"])
def upload_file():

    try:

        file = request.files["file"]
        course_id = request.form["course_id"]

        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO course_files (course_id, file_name, file_path)
            VALUES (%s,%s,%s)
            """,
            (course_id, filename, filepath)
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"status": "uploaded"})

    except Exception as e:
        print("Upload error:", e)
        return jsonify({"status": "fail"}), 500

# ======================================================
# =============== GET FOLIOS ===========================
# ======================================================

@app.route("/employee/folios/<employee_email>", methods=["GET"])
def get_folios(employee_email):
    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT student_email
            FROM folios
            WHERE employee_email = %s
        """, (employee_email,))

        folios = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify([
            {"student_email": f[0]}
            for f in folios
        ])

    except Exception as e:
        print("Fetch folios error:", e)
        return jsonify({"status": "fail"}), 500

@app.route("/employee/tasks/<course_id>", methods=["GET"])
def get_employee_tasks(course_id):

    try:

        print("Fetching tasks for course:", course_id)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT task_id, question, marks, is_unlocked
        FROM course_tasks
        WHERE course_id = %s
        ORDER BY task_id
        """, (course_id,))

        tasks = cur.fetchall()

        cur.close()
        conn.close()

        result = []

        for t in tasks:
            result.append({
                "task_id": t[0],
                "question": t[1],
                "marks": t[2],
                "is_unlocked": t[3]
            })

        return jsonify(result)

    except Exception as e:
        print("Fetch employee tasks error:", e)
        return jsonify([])
# ======================================================
# ================= FILE DOWNLOAD ======================
# ======================================================

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)


# ======================================================
# ================= RUN SERVER =========================
# ======================================================

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")