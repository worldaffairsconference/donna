import csv
import random

# ===============================
# 1) Read CSV data, remove header, and randomize student order
# ===============================
with open("scripts/teachers_students_data.csv", newline="") as f:
    reader = csv.reader(f)
    data = list(reader)

if data and "TeacherID" in data[0]:
    data.pop(0)

random.shuffle(data)

# ===============================
# 2) Plenary details for this year
# ===============================
plenDetails = {
    "p1o1": { "time": "10:25 AM - 11:15 AM", "title": "Keith Pelley | The Future of Maple Leafs Sports and Entertainment", "speaker": "Keith Pelley", "location": "Laidlaw Hall" },
    "p1o2": { "time": "10:25 AM - 11:15 AM", "title": "Organ Donation and Transplant - Success on the Edge", "speaker": "Andrew Healey", "location": "Student Centre" },
    "p1o3": { "time": "10:25 AM - 11:15 AM", "title": "Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War", "speaker": "John Sitilides", "location": "Manucha & Bellamy Studio Theatre" },
    "p1o4": { "time": "10:25 AM - 11:15 AM", "title": "Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones", "speaker": "Dr. Jeremy Wang", "location": "Rooms 248 + 249" },
    "p1o5": { "time": "10:25 AM - 11:15 AM", "title": "Biodiversity Conservation in a Rapidly Changing Environment: A Canadian Perspective", "speaker": "Dr. Justina Ray", "location": "Room 232" },
    "p2o1": { "time": "11:45 AM - 12:35 PM", "title": "Breaking Barriers: Engaging Men in Gender Equality for a Better World", "speaker": "Michael Kaufman", "location": "Laidlaw Hall" },
    "p2o2": { "time": "11:45 AM - 12:35 PM", "title": "Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy", "speaker": "Sylvia Torres Guillen", "location": "Student Centre" },
    "p2o3": { "time": "11:45 AM - 12:35 PM", "title": "Imagining the Future: Building on the Past", "speaker": "Shirley Blumberg", "location": "Manucha & Bellamy Studio Theatre" },
    "p2o4": { "time": "11:45 AM - 12:35 PM", "title": "Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication", "speaker": "John Smol", "location": "Rooms 248 + 249" },
    "p2o5": { "time": "11:45 AM - 12:35 PM", "title": "Eyes on the Frontlines: Challenges and Triumphs of Reporting in Conflict Zones", "speaker": "Wolfgang Schwartz and Yan Boechat", "location": "Room 232" },
    "p3o1": { "time": "1:35 PM - 2:25 PM", "title": "Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?", "speaker": "James Suh", "location": "Laidlaw Hall" },
    "p3o2": { "time": "1:35 PM - 2:25 PM", "title": "From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation", "speaker": "Emma Lozhkin", "location": "Student Centre" },
    "p3o3": { "time": "1:35 PM - 2:25 PM", "title": "High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato", "speaker": "Eric Zhu", "location": "Manucha & Bellamy Studio Theatre" },
    "p3o4": { "time": "1:35 PM - 2:25 PM", "title": "From Idea to Reality – Using the Earth as a Battery", "speaker": "Curtis VanWelleghem", "location": "Rooms 248 + 249" },
    "p3o5": { "time": "1:35 PM - 2:25 PM", "title": "AI Horizons: Inspiring the Next Generation of Innovators", "speaker": "Dr. Sebastian Maurice", "location": "Room 232" }
}

# ===============================
# 3) Define location-based capacities
# ===============================
location_capacity = {
    "Manucha & Bellamy Studio Theatre": 100,
    "Room 232": 35,
    "Laidlaw Hall": 800,
    "Student Centre": 180,
    "Rooms 248 + 249": 55
}

# ===============================
# 4) Build the schedule per session from plenDetails.
# Each session is a sorted list of tuples: (option_id, location)
# ===============================
session1 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p1")])
session2 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p2")])
session3 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p3")])
schedule = [session1, session2, session3]

# ===============================
# 5) Build the 'spots' array based on location capacity.
# ===============================
spots = []
for sess in schedule:
    row_spots = []
    for (option_id, loc) in sess:
        cap = location_capacity.get(loc, 9999)
        row_spots.append(cap)
    spots.append(row_spots)

# ===============================
# 6) Assignment function for one session.
#
# If all submitted preferences are "None" (case-insensitive), return ("Pending", "Pending").
# Otherwise, for each submitted preference (Rank 1, then Rank 2, then Rank 3):
#   - If the option has available capacity (spots > 0), decrement capacity and return that option with "Rank X".
#   - If the option's capacity is 0, do NOT assign it.
# If no submitted preference can be assigned, return ("N/A", None).
# ===============================
def assign_session_with_rank(session_index, rank_preferences):
    sess = schedule[session_index]
    sess_spots = spots[session_index]
    # If all submitted preferences are "None", mark as pending.
    if all(pref.lower() == "none" for pref in rank_preferences):
        return "Pending", "Pending"
    # Process each submitted preference in order.
    for rank, pref in enumerate(rank_preferences, start=1):
        if pref.lower() == "none":
            continue
        for idx, (option_id, loc) in enumerate(sess):
            if pref == option_id and sess_spots[idx] > 0:
                sess_spots[idx] -= 1
                return option_id, f"Rank {rank}"
    # If none of the submitted preferences have available capacity, return "N/A".
    return "N/A", None

# Create container for pending assignments per session.
pending_assignments = {0: [], 1: [], 2: []}

# ===============================
# 7) Process each student row and assign options.
#
# If teacherName is "WAC Exec" (case-insensitive), set assignments to "Ignored".
# If all submitted preferences for a session are "None", mark that student as pending for that session.
# ===============================
assigned_plen = []
option_counts = { key: 0 for key in plenDetails.keys() }
rank_tally = { "Rank 1": 0, "Rank 2": 0, "Rank 3": 0 }
detailed_assignments = { key: [] for key in plenDetails.keys() }

for i, row in enumerate(data):
    teacherID    = row[0].strip()
    teacherName  = row[1].strip()
    teacherEmail = row[2].strip()
    teacherSchool= row[3].strip()
    studentID    = row[4].strip()
    studentName  = row[5].strip()
    studentEmail = row[6].strip()
    studentGrade = row[7].strip()
    lunch        = row[8].strip()
    
    if teacherName.lower() == "wac exec":
        a_opt, a_choice = "Ignored", "Ignored"
        b_opt, b_choice = "Ignored", "Ignored"
        c_opt, c_choice = "Ignored", "Ignored"
    else:
        p1_prefs = [row[9].strip(), row[10].strip(), row[11].strip()]
        p2_prefs = [row[12].strip(), row[13].strip(), row[14].strip()]
        p3_prefs = [row[15].strip(), row[16].strip(), row[17].strip()] if len(row) > 17 else ["", "", ""]
        a_opt, a_choice = assign_session_with_rank(0, p1_prefs)
        b_opt, b_choice = assign_session_with_rank(1, p2_prefs)
        c_opt, c_choice = assign_session_with_rank(2, p3_prefs)
        if a_opt == "Pending":
            pending_assignments[0].append(i)
        if b_opt == "Pending":
            pending_assignments[1].append(i)
        if c_opt == "Pending":
            pending_assignments[2].append(i)
    
    record = [teacherID, teacherName, teacherEmail, teacherSchool,
              studentID, studentName, studentEmail, studentGrade, lunch,
              f"{a_opt} ({a_choice})", f"{b_opt} ({b_choice})", f"{c_opt} ({c_choice})"]
    note = row[18].strip() if len(row) > 18 else ""
    record.append(note)
    assigned_plen.append(record)
    
    student_identifier = f"{studentName} ({studentID})"
    for opt, choice in [(a_opt, a_choice), (b_opt, b_choice), (c_opt, c_choice)]:
        if opt not in ["N/A", "Ignored", "Pending"]:
            option_counts[opt] += 1
            if choice in rank_tally:
                rank_tally[choice] += 1
            detailed_assignments[opt].append((student_identifier, choice))

# ===============================
# 7b) Process pending assignments.
#
# For each pending student in each session, try to assign an option:
# - Look for the first option with available capacity.
# - If no option is available, leave as "Pending".
# ===============================
for session_index in [0, 1, 2]:
    sess = schedule[session_index]
    sess_spots = spots[session_index]
    for i in pending_assignments[session_index]:
        assigned = False
        for idx, (option_id, loc) in enumerate(sess):
            if sess_spots[idx] > 0:
                sess_spots[idx] -= 1
                if session_index == 0:
                    assigned_plen[i][9] = f"{option_id} (Filled)"
                elif session_index == 1:
                    assigned_plen[i][10] = f"{option_id} (Filled)"
                elif session_index == 2:
                    assigned_plen[i][11] = f"{option_id} (Filled)"
                option_counts[option_id] += 1
                detailed_assignments[option_id].append((f"{assigned_plen[i][5]} ({assigned_plen[i][4]})", "Filled"))
                assigned = True
                break
        # If no option with available capacity is found, the assignment remains "Pending"

# ===============================
# 8) Write the flattened output to a CSV file.
# ===============================
with open("scripts/test.txt", "w", newline="") as f:
    writer = csv.writer(f)
    header = ["TeacherID", "TeacherName", "TeacherEmail", "TeacherSchool",
              "StudentID", "Name", "Email", "Grade", "Lunch",
              "Plenary1 Assigned (with Choice)", "Plenary2 Assigned (with Choice)", "Plenary3 Assigned (with Choice)", "Note"]
    writer.writerow(header)
    for rec in assigned_plen:
        writer.writerow(rec)

# ===============================
# 9) Print summary of assignments per plenary option and overall rank tally to the terminal.
# ===============================
print("\n=== Plenary Assignment Summary ===")
for option_id, info in plenDetails.items():
    count = option_counts.get(option_id, 0)
    print(f"{option_id} -> {count} assigned | {info['title']} ({info['location']})")

print("\n=== Overall Rank Tally ===")
print(f"Rank 1: {rank_tally['Rank 1']}")
print(f"Rank 2: {rank_tally['Rank 2']}")
print(f"Rank 3: {rank_tally['Rank 3']}")

# ===============================
# 10) Write detailed assignments to a text file.
# Each option will list the students assigned along with the rank choice they received.
# ===============================
with open("scripts/detailed_assignments.txt", "w") as f:
    f.write("=== Detailed Assignment per Plenary Option ===\n\n")
    for option_id, assignments in detailed_assignments.items():
        info = plenDetails[option_id]
        f.write(f"{option_id} | {info['title']} ({info['location']}):\n")
        if assignments:
            for student, choice in assignments:
                f.write(f"  - {student} => {choice}\n")
        else:
            f.write("  None assigned\n")
        f.write("\n")

# ===============================
# 11) (Optional) Print final tally per plenary option with student identifiers.
# ===============================
# Uncomment if needed.
# print("\n=== Final Tally per Plenary Option ===")
# for option_id, info in plenDetails.items():
#     assigned_students = detailed_assignments.get(option_id, [])
#     print(f"{option_id} | {info['title']} ({info['location']}) -> {len(assigned_students)} assigned:")
#     for student, choice in assigned_students:
#         print(f"    {student} ({choice})")
#     print()
