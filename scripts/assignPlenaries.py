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
        row_spots.append(location_capacity.get(loc, 9999))
    spots.append(row_spots)

# ===============================
# 6) Assignment function for one session.
#
# This function processes the student's submitted preferences for the session.
# It ignores any "None" entries. For each preference in order:
#   - If that option has available capacity (spots > 0), it decrements the capacity and returns that option ID.
# If none of the submitted preferences can be assigned (i.e. they are either "None" or all options are full),
# it returns ("N/A", None).
# ===============================
def assign_session_with_rank(session_index, rank_preferences):
    sess = schedule[session_index]
    sess_spots = spots[session_index]
    if all(pref.lower() == "none" for pref in rank_preferences):
        return "Pending", "Pending"
    for rank, pref in enumerate(rank_preferences, start=1):
        if pref.lower() == "none":
            continue
        for idx, (option_id, loc) in enumerate(sess):
            if pref == option_id and sess_spots[idx] > 0:
                sess_spots[idx] -= 1
                return option_id, f"Rank {rank}"
    return "N/A", None

# ===============================
# 7) Process each student row and assign options.
#
# If teacherName is "WAC Exec" (case-insensitive), set assignments to "exec".
# Otherwise, for each session, assign the option using the assignment function.
# The final record contains teacher and student info and the final assigned plenary IDs (without rank labels).
# ===============================
assigned_plen = []
option_counts = { key: 0 for key in plenDetails.keys() }
# (For pending assignments, we'll later reprocess them if needed.)
pending_assignments = {0: [], 1: [], 2: []}

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
        a_opt, b_opt, c_opt = "exec", "exec", "exec"
    else:
        p1_prefs = [row[9].strip(), row[10].strip(), row[11].strip()]
        p2_prefs = [row[12].strip(), row[13].strip(), row[14].strip()]
        p3_prefs = [row[15].strip(), row[16].strip(), row[17].strip()] if len(row) > 17 else ["", "", ""]
        a_opt, _ = assign_session_with_rank(0, p1_prefs)
        b_opt, _ = assign_session_with_rank(1, p2_prefs)
        c_opt, _ = assign_session_with_rank(2, p3_prefs)
        # If any assignment returns "Pending", record the index for later processing.
        if a_opt == "Pending":
            pending_assignments[0].append(i)
        if b_opt == "Pending":
            pending_assignments[1].append(i)
        if c_opt == "Pending":
            pending_assignments[2].append(i)
    
    record = [teacherID, teacherName, teacherEmail, teacherSchool,
              studentID, studentName, studentEmail, studentGrade, lunch,
              a_opt, b_opt, c_opt]
    note = row[18].strip() if len(row) > 18 else ""
    record.append(note)
    assigned_plen.append(record)
    
    for opt in [a_opt, b_opt, c_opt]:
        if opt not in ["N/A", "Ignored", "Pending", "exec"]:
            option_counts[opt] += 1

# ===============================
# 7b) Reprocess pending assignments.
#
# For each pending student (one for each session), try to assign the first option with available capacity.
# If none is available, force assign the Laidlaw Hall option (this forced assignment counts normally).
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
                    assigned_plen[i][9] = option_id
                elif session_index == 1:
                    assigned_plen[i][10] = option_id
                elif session_index == 2:
                    assigned_plen[i][11] = option_id
                option_counts[option_id] += 1
                assigned = True
                break
        if not assigned:
            # If no option with capacity is available, force assign the Laidlaw Hall option.
            for idx, (option_id, loc) in enumerate(sess):
                if loc == "Laidlaw Hall":
                    if session_index == 0:
                        assigned_plen[i][9] = option_id
                    elif session_index == 1:
                        assigned_plen[i][10] = option_id
                    elif session_index == 2:
                        assigned_plen[i][11] = option_id
                    option_counts[option_id] += 1
                    break

# ===============================
# 8) Write the flattened output to an output.txt file.
# The output file will contain all teacher/student information and only the final assigned plenary IDs (no rank labels).
# ===============================
with open("scripts/output.txt", "w", newline="") as f:
    writer = csv.writer(f)
    header = ["TeacherID", "TeacherName", "TeacherEmail", "TeacherSchool",
              "StudentID", "StudentName", "StudentEmail", "Grade", "Lunch",
              "Plenary1 Assigned", "Plenary2 Assigned", "Plenary3 Assigned", "Note"]
    writer.writerow(header)
    for rec in assigned_plen:
        writer.writerow(rec)

# ===============================
# 9) Print summary of assignments per plenary option to the terminal.
# ===============================
print("\n=== Plenary Assignment Summary ===")
for option_id, info in plenDetails.items():
    count = option_counts.get(option_id, 0)
    print(f"{option_id} -> {count} assigned | {info['title']} ({info['location']})")

# ===============================
# 10) Print overall tally of assignments by rank.
# (Since we removed rank labels from final output, if you need to tally rank1/2/3,
#  you would need to count them during assignment. In this version, we simply print the counts.)
# (Uncomment the following if you have a separate rank tally dictionary.)
#
# print("\n=== Overall Rank Tally ===")
# print(f"Rank 1: {rank_tally['Rank 1']}")
# print(f"Rank 2: {rank_tally['Rank 2']}")
# print(f"Rank 3: {rank_tally['Rank 3']}")
