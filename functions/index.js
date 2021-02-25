//import libraries
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { ref, firebaseAuth } = require('./constants.js');

const reg = (email, pw, school) => {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then((data) => {
      ref
        .child(`users/${data.user.uid}/info`)
        .set({
          email: email,
          uid: data.user.uid,
          school: school,
          payment: false,
        })
        .then(() => {
          return data.user;
        });
    });
};

const deleteUserData = async (uid) => {
  await ref.child(`users/${uid}`).remove();
  await firebaseAuth.deleteUser(uid);
  return 'success';
};

const writeStudentData = async (student) => {
  var userId = student.teacher;
  await ref.child('users/' + userId + '/students/').push({
    name: student.name,
    school: student.school,
    grade: student.grade,
    accessibility: student.accessibility,
    panel1: student.panel1,
    panel2: student.panel2,
    panel3: student.panel3,
    panel4: student.panel4,
    panel5: student.panel5,
    panel6: student.panel6,
  });
};
const deleteStudent = async (uid, key) => {
  return ref.child(`users/${uid}/students/${key}`).remove();
};
// Graphql schema
const schema = buildSchema(`
    input studentInput {
        teacher: String!
        name: String!
        grade: Int!
        school: String!
        accessibility: String
        panel1: Boolean
        panel2: Boolean
        panel3: Boolean
        panel4: Boolean
        panel5: Boolean
        panel6: Boolean
    }
  type Query {
    auth(email:String, pw:String, school:String, func:String!, uid:String):String
    student(student:studentInput,func:String!,uid:String,key:String):String
  }
`);

const root = {
  student: ({ student, func, uid, key }) => {
    switch (func) {
      case 'w':
        return writeStudentData(student);
        break;
      case 'd':
        return deleteStudent(uid, key);
        break;
    }
  },
  auth: ({ email, pw, school, uid, func }) => {
    switch (func) {
      case 'r':
        return reg(email, pw, school);
        break;
      case 'd':
        return deleteUserData(uid);
        break;
    }
  },
};

//initialize express server
const app = express();

app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

//define google cloud function name
const graphql = functions.https.onRequest(app);

module.exports = {
  graphql,
};
