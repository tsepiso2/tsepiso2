mport random

# Limkokwing Lesotho IT Courses (feel free to add more)
it_courses = [
    "Bachelor of Science (Hons) in Information Technology",
    "Bachelor of Science (Hons) in Business Information Technology"
]

# Modules for the semester
modules = [
    "Introduction to Data Communication",
    "Introduction to Computer Design",
    "Principles of Software Engineering",
    "Calculus 1",
    "Imperative Programming",
    "Introduction to Databases"
]

# Grading logic
def grade_mark(mark):
    if 90 <= mark <= 100:
        return "Distinction", "A+"
    elif 85 <= mark <= 89:
        return "Passed", "A"
    elif 75 <= mark <= 84:
        return "Pass", "B+"
    elif 65 <= mark <= 74:
        return "Pass", "B"
    elif 55 <= mark <= 64:
        return "Pass", "C+"
    elif 50 <= mark <= 54:
        return "Pass", "C"
    elif 45 <= mark <= 49:
        return "Supplement", "F"
    else:
        return "Repeat", "F"

# Input student details
student_number = input("Enter Student Number: ")
student_name = input("Enter Student Name: ")

# Randomly assign one of the IT courses
course_of_study = random.choice(it_courses)

print("\n--- Academic Semester Results ---")
print(f"Student Number : {student_number}")
print(f"Student Name   : {student_name}")
print(f"Course of Study: {course_of_study}\n")

# Track overall result
all_above_50 = True

# Display results for each module
for module in modules:
    mark = random.randint(10, 100)
    remark, grade = grade_mark(mark)
    print(f"{module}: {mark}% - {remark} ({grade})")
    if mark < 50:
        all_above_50 = False

# Final result
if all_above_50:
    print("\n✅ All modules passed. Proceed to 2nd year.")
else:
    print("\n❌ Some modules not passed. Cannot proceed to 2nd year.")