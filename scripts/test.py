import csv

# ===============================
# 1) Read CSV data and remove header
# ===============================
with open("scripts/teachers_students_data.csv", newline='') as f:
    reader = csv.reader(f)
    data = list(reader)

# Remove the header row if present (adjust the condition as needed)
if data and "TeacherID" in data[0]:
    data.pop(0)

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
# 4) Build the schedule per session from plenDetails
#     Session 1: keys starting with "p1"
#     Session 2: keys starting with "p2"
#     Session 3: keys starting with "p3"
#     Each session is a list of tuples: (option_id, location)
# ===============================
session1 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p1")])
session2 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p2")])
session3 = sorted([(key, plenDetails[key]["location"]) for key in plenDetails if key.startswith("p3")])
schedule = [session1, session2, session3]

# ===============================
# 5) Build a parallel 'spots' array based on each option's location capacity
# ===============================
spots = []
for sess in schedule:
    row_spots = []
    for (option_id, loc) in sess:
        cap = location_capacity.get(loc, 9999)  # fallback if not found
        row_spots.append(cap)
    spots.append(row_spots)

# ===============================
# 6) Assignment function for a single session.
#
# Given a list of rank preferences (in order) for one session,
# this function checks each preference and returns the first option
# that is available (has capacity) and hasn't been assigned already.
# If none of the submitted preferences is available,
# it then attempts to assign the Laidlaw Hall option.
# ===============================
def assign_session(session_index, rank_preferences):
    sess = schedule[session_index]
    sess_spots = spots[session_index]
    # Try each submitted preference in order.
    for pref in rank_preferences:
        for idx, (option_id, loc) in enumerate(sess):
            if pref == option_id and sess_spots[idx] > 0:
                sess_spots[idx] -= 1
                return option_id
    # Fallback: assign the Laidlaw Hall option if available.
    for idx, (option_id, loc) in enumerate(sess):
        if loc == "Laidlaw Hall" and sess_spots[idx] > 0:
            sess_spots[idx] -= 1
            return option_id
    return "N/A"

# ===============================
# 7) Process each student row and assign one option per session.
#
# We assume the CSV row structure is:
# [TeacherID, TeacherName, TeacherEmail, TeacherSchool,
#  StudentID, Name, Email, Grade, Lunch,
#  Plenary1 Rank 1, Plenary1 Rank 2, Plenary1 Rank 3,
#  Plenary2 Rank 1, Plenary2 Rank 2, Plenary2 Rank 3,
#  Plenary3 Rank 1, Plenary3 Rank 2, Plenary3 Rank 3, Note]
# Adjust indexes as needed.
# ===============================
assigned_plen = []
# Count assignments per option
counts = { key: 0 for key in plenDetails.keys() }

for row in data:
    # Debug: print the row
    print(row)
    
    teacherID    = row[0].strip()
    teacherName  = row[1].strip()
    teacherEmail = row[2].strip()
    teacherSchool= row[3].strip()
    studentID    = row[4].strip()
    studentName  = row[5].strip()
    studentEmail = row[6].strip()
    studentGrade = row[7].strip()
    lunch        = row[8].strip()
    
    # For each session, assume the three rank preferences are consecutive.
    # For Plenary1: columns 9,10,11
    p1_pref = [row[9].strip(), row[10].strip(), row[11].strip()]
    # For Plenary2: columns 12,13,14
    p2_pref = [row[12].strip(), row[13].strip(), row[14].strip()]
    # For Plenary3: columns 15,16,17 (if present)
    p3_pref = [row[15].strip(), row[16].strip(), row[17].strip()] if len(row) > 17 else ["", "", ""]
    
    # For each session, assign the option once.
    a1 = assign_session(0, p1_pref)
    b1 = assign_session(1, p2_pref)
    c1 = assign_session(2, p3_pref)
    
    # Update counts if assigned
    for opt in [a1, b1, c1]:
        if opt != "N/A":
            counts[opt] += 1
    
    # Build a flattened record.
    # Here, we include teacher info, student info, and the assigned option for each session.
    record = [teacherID, teacherName, teacherEmail, teacherSchool,
              studentID, studentName, studentEmail, studentGrade, lunch,
              a1, b1, c1]
    
    # Append note if present (assumed column 18)
    note = row[18].strip() if len(row) > 18 else ""
    record.append(note)
    
    assigned_plen.append(record)

# ===============================
# 8) Write the flattened output to a CSV file
# ===============================
with open("test.txt", "w", newline="") as f:
    writer = csv.writer(f)
    header = ["TeacherID","TeacherName","TeacherEmail","TeacherSchool",
              "StudentID","Name","Email","Grade","Lunch",
              "Plenary1 Assigned","Plenary2 Assigned","Plenary3 Assigned","Note"]
    writer.writerow(header)
    for rec in assigned_plen:
        writer.writerow(rec)

# ===============================
# 9) Print summary of assignments per plenary option (with title and location)
# ===============================
print("\n=== Plenary Assignment Summary ===")
for option_id, info in plenDetails.items():
    count = counts.get(option_id, 0)
    print(f"{option_id} -> {count} assigned | {info['title']} ({info['location']})")
