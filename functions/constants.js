const admin = require("firebase-admin");

const serviceAccount = require("./adminKey.json");

const donna = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wac-donna-default-rtdb.firebaseio.com",
});

const ref = donna.database().ref();
const firebaseAuth = donna.auth();
module.exports = {
  ref,
  firebaseAuth,
};
