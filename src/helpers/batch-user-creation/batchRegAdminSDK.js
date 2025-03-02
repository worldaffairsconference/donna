
//READ BELOW BEFORE CONTINUING

/*

DO NOT MOVE YOUR SERVICE ACCOUNT KEY INTO DONNA AND ENSURE BEFORE PUSHING CHANGES IT IS NOT PRESENT IN ANY COMMITS.
PUSHING THIS KEY TO GITHUB CAN ALLOW UNWANTED ACCESS TO THE DATABASE IF IT IS ACQUIRED BY A THIRD PARTY


*/

const fs = require('fs');
const Papa = require('papaparse');
const admin = require('firebase-admin');

// Initialize Admin SDK using your private key found under settings > project settings > service accounts
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //This may need to be changed, found top of the realtime database
  databaseURL: '',
});

// Path of CSV file, make sure column headers are: first name, last name, email, year, access (access code, do not put this bracket)
const csvData = fs.readFileSync('Pathname', 'utf8');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
const rows = parsed.data;

(async () => {
  for (const row of rows) {
    // Normalize fields
    const normalizedRow = Object.keys(row).reduce((acc, key) => {
      const newKey = key.toLowerCase().replace(/\s+/g, '');
      acc[newKey] = row[key];
      return acc;
    }, {});

    // Check that required fields exist
    if (
      !normalizedRow.email ||
      !normalizedRow.firstname ||
      !normalizedRow.lastname ||
      !(normalizedRow.grade || normalizedRow.yearlevel) ||
      !normalizedRow.access
    ) {
      console.error('Missing required fields in row:', normalizedRow);
      continue;
    }

    try {
      // Combine first and last name
      const fullName = `${normalizedRow.firstname} ${normalizedRow.lastname}`;
      // Get grade from either grade or yearlevel and remove "Year" if present
      let grade = normalizedRow.grade || normalizedRow.yearlevel;
      grade = grade.replace(/year\s*/i, '').trim();
      // Use the access code from CSV (trim whitespace)
      const access = normalizedRow.access.trim();
      // Generate a random temporary password for creation (you can adjust this as needed)
      const pw = (Math.random() + 1).toString(36);

      // Create the user using Admin SDK
      const userRecord = await admin.auth().createUser({
        email: normalizedRow.email,
        password: pw,
        displayName: fullName,
      });
      console.log('Created user:', userRecord.uid);

      // Write extra details to Realtime Database
      await admin.database().ref(`teachers/${access}/students/${userRecord.uid}`).set({
        email: normalizedRow.email,
        name: fullName,
        grade: grade,
        p1: { rank1: '', rank2: '', rank3: '' },
        p2: { rank1: '', rank2: '', rank3: '' },
        p3: { rank1: '', rank2: '', rank3: '' },
        plen1: '',
        plen2: '',
        plen3: '',
        note: '',
        lunch: false,
      });

      // Optionally, write a reference in a global students node
      await admin.database().ref(`students/${userRecord.uid}`).set({
        teacherID: access,
      });

      console.log(`Registered ${normalizedRow.email} with uid: ${userRecord.uid}`);
    } catch (error) {
      console.error('Error registering attendee for', normalizedRow.email, error);
    }
    //await delay(100);
  }
  console.log('Batch registration complete!');

})();
