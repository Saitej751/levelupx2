from flask import Blueprint, request, jsonify
import psycopg2

employee_bp = Blueprint("employees", __name__)

# ----------------------------------
# DATABASE CONNECTION
# ----------------------------------
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="levelupx",
        user="postgres",
        password="1234"   # 🔴 change this
    )


# ----------------------------------
# CREATE COURSE
# ----------------------------------
@employee_bp.route("/employee/create-course", methods=["POST"])
def create_course():
    try:
        data = request.get_json()

        employee_email = data.get("employee_email")
        course_name = data.get("course_name")

        if not employee_email or not course_name:
            return jsonify({"status": "fail", "message": "Missing data"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO courses (course_name, created_by)
            VALUES (%s, %s)
            RETURNING course_id
        """, (course_name, employee_email))

        course_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "status": "success",
            "course_id": course_id
        })

    except Exception as e:
        print("Create course error:", e)
        return jsonify({"status": "fail"}), 500


# ----------------------------------
# ADD TASK TO COURSE
# ----------------------------------
@employee_bp.route("/employee/add-task", methods=["POST"])
def add_task():
    try:
        data = request.get_json()

        course_id = data.get("course_id")
        question = data.get("question")
        marks = data.get("marks")
        allow_tab_switch = data.get("allow_tab_switch", False)
        allow_copy_paste = data.get("allow_copy_paste", False)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO course_tasks
            (course_id, question, marks, allow_tab_switch, allow_copy_paste)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING task_id
        """, (
            course_id,
            question,
            marks,
            allow_tab_switch,
            allow_copy_paste
        ))

        task_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "status": "success",
            "task_id": task_id
        })

    except Exception as e:
        print("Add task error:", e)
        return jsonify({"status": "fail"}), 500


# ----------------------------------
# ASSIGN STUDENTS TO TASK
# ----------------------------------
@employee_bp.route("/employee/assign-task", methods=["POST"])
def assign_task():
    try:
        data = request.get_json()

        task_id = data.get("task_id")
        student_emails = data.get("student_emails")

        if not task_id or not student_emails:
            return jsonify({"status": "fail", "message": "Missing data"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        for email in student_emails:
            cur.execute("""
                INSERT INTO task_allowed_students
                (task_id, student_email)
                VALUES (%s, %s)
            """, (task_id, email))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"status": "assigned"})

    except Exception as e:
        print("Assign error:", e)
        return jsonify({"status": "fail"}), 500